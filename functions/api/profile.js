import { ensureInitialized, jsonResponse, verifyAdminSession } from './_utils.js';

export async function onRequestPut(context) {
  const { request, env } = context;
  try {
    await ensureInitialized(env.DB);
    const session = await verifyAdminSession(request, env.DB);
    if (!session) {
      return jsonResponse({ ok: false, error: 'Unauthorized. Please sign in.' }, 401);
    }

    const body = await request.json();
    const title = (body.title || 'VayzTech').trim();
    const handle = (body.handle || '@vayztech').trim();
    const bio = String(body.bio || '');
    const avatar_url = (body.avatar_url || '').trim();
    const avatar_color = body.avatar_color === false || body.avatar_color === 0 ? 0 : 1;
    const bg_image_url = (body.bg_image_url || '').trim();
    const bg_blur = typeof body.bg_blur === 'number' ? body.bg_blur : Number(body.bg_blur ?? 28);
    const bg_overlay =
      typeof body.bg_overlay === 'number' ? body.bg_overlay : Number(body.bg_overlay ?? 55);
    const cat_offset_y =
      typeof body.cat_offset_y === 'number' ? body.cat_offset_y : Number(body.cat_offset_y ?? 0);
    const carousel_interval =
      typeof body.carousel_interval === 'number'
        ? body.carousel_interval
        : Number(body.carousel_interval ?? 5);
    const tiktok_url = (body.tiktok_url || '').trim();
    const email = (body.email || '').trim();
    const theme_default = body.theme_default === 'dark' ? 'dark' : 'light';

    await env.DB.prepare(
      `UPDATE profile
       SET title = ?, handle = ?, bio = ?, avatar_url = ?, avatar_color = ?, bg_image_url = ?, bg_blur = ?, bg_overlay = ?, cat_offset_y = ?, carousel_interval = ?, tiktok_url = ?, email = ?, theme_default = ?, updated_at = strftime('%s', 'now')
       WHERE id = 1`
    )
      .bind(
        title,
        handle,
        bio,
        avatar_url,
        avatar_color,
        bg_image_url,
        bg_blur,
        bg_overlay,
        cat_offset_y,
        carousel_interval,
        tiktok_url,
        email,
        theme_default
      )
      .run();

    const updated = await env.DB.prepare('SELECT * FROM profile WHERE id = 1').first();
    return jsonResponse({ ok: true, profile: updated });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || 'Failed to update profile' }, 500);
  }
}
