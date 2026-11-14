import { ensureInitialized, jsonResponse } from './_utils.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    await ensureInitialized(env.DB);
    const body = await request.json();
    const id = Number(body.id);
    if (!id) {
      return jsonResponse({ ok: false, error: 'Invalid link ID' }, 400);
    }

    await env.DB.prepare('UPDATE links SET clicks = clicks + 1 WHERE id = ?').bind(id).run();
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
}
