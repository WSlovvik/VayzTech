import { jsonResponse } from './_utils.js';

export async function onRequestGet(context) {
  const { request } = context;
  const urlObj = new URL(request.url);
  let handle = (urlObj.searchParams.get('handle') || '').trim().replace(/^@/, '');

  if (!handle) {
    return jsonResponse({ ok: false, error: 'TikTok handle is required' }, 400);
  }

  try {
    // Strategy 1: Fetch TikTok profile page and parse og:image / avatarLarger
    const profileUrl = `https://www.tiktok.com/@${encodeURIComponent(handle)}`;
    const res = await fetch(profileUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    if (res.ok) {
      const html = await res.text();
      const avatarMatch =
        html.match(/"avatarLarger"\s*:\s*"([^"]+)"/) ||
        html.match(/"avatarMedium"\s*:\s*"([^"]+)"/) ||
        html.match(/property="og:image"\s+content="([^"]+)"/);

      if (avatarMatch && avatarMatch[1]) {
        const decodedUrl = avatarMatch[1]
          .replace(/\\u002F/g, '/')
          .replace(/\\u0026/g, '&')
          .replace(/&amp;/g, '&');
        return jsonResponse({
          ok: true,
          avatar_url: decodedUrl,
          source: 'tiktok_direct',
        });
      }
    }

    // Strategy 2: Fallback to Unavatar TikTok resolver
    return jsonResponse({
      ok: true,
      avatar_url: `https://unavatar.io/tiktok/${encodeURIComponent(handle)}`,
      source: 'unavatar',
    });
  } catch (_) {
    return jsonResponse({
      ok: true,
      avatar_url: `https://unavatar.io/tiktok/${encodeURIComponent(handle)}`,
      source: 'unavatar_fallback',
    });
  }
}
