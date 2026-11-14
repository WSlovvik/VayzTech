import { ensureInitialized, jsonResponse, verifyAdminSession } from './_utils.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    await ensureInitialized(env.DB);
    const session = await verifyAdminSession(request, env.DB);
    if (!session) {
      return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
    }

    const body = await request.json();
    const title = (body.title || '').trim();
    const description = (body.description || '').trim();
    const url = (body.url || '').trim();
    const image_url = (body.image_url || '').trim();
    const active = body.active === false || body.active === 0 ? 0 : 1;

    if (!title || !url) {
      return jsonResponse({ ok: false, error: 'Title and URL are required.' }, 400);
    }

    const maxRow = await env.DB.prepare(
      'SELECT COALESCE(MAX(sort_order), 0) as maxOrder FROM carousel_items'
    ).first();
    const sort_order = (maxRow?.maxOrder || 0) + 1;

    await env.DB.prepare(
      'INSERT INTO carousel_items (title, description, url, image_url, sort_order, active) VALUES (?, ?, ?, ?, ?, ?)'
    )
      .bind(title, description, url, image_url, sort_order, active)
      .run();

    const { results: carousel } = await env.DB.prepare(
      'SELECT * FROM carousel_items ORDER BY sort_order ASC, id ASC'
    ).all();

    return jsonResponse({ ok: true, carousel });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || 'Failed to add carousel slide' }, 500);
  }
}

export async function onRequestPut(context) {
  const { request, env } = context;
  try {
    await ensureInitialized(env.DB);
    const session = await verifyAdminSession(request, env.DB);
    if (!session) {
      return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
    }

    const body = await request.json();

    if (Array.isArray(body.order)) {
      const statements = body.order.map((item, idx) =>
        env.DB.prepare('UPDATE carousel_items SET sort_order = ? WHERE id = ?').bind(
          idx + 1,
          item.id
        )
      );
      if (statements.length > 0) {
        await env.DB.batch(statements);
      }
      const { results: carousel } = await env.DB.prepare(
        'SELECT * FROM carousel_items ORDER BY sort_order ASC, id ASC'
      ).all();
      return jsonResponse({ ok: true, carousel });
    }

    const id = Number(body.id);
    if (!id) {
      return jsonResponse({ ok: false, error: 'Slide ID is required.' }, 400);
    }

    const title = (body.title || '').trim();
    const description = (body.description || '').trim();
    const url = (body.url || '').trim();
    const image_url = (body.image_url || '').trim();
    const active = body.active === false || body.active === 0 ? 0 : 1;

    await env.DB.prepare(
      'UPDATE carousel_items SET title = ?, description = ?, url = ?, image_url = ?, active = ? WHERE id = ?'
    )
      .bind(title, description, url, image_url, active, id)
      .run();

    const { results: carousel } = await env.DB.prepare(
      'SELECT * FROM carousel_items ORDER BY sort_order ASC, id ASC'
    ).all();

    return jsonResponse({ ok: true, carousel });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || 'Failed to update slide' }, 500);
  }
}

export async function onRequestDelete(context) {
  const { request, env } = context;
  try {
    await ensureInitialized(env.DB);
    const session = await verifyAdminSession(request, env.DB);
    if (!session) {
      return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
    }

    const urlObj = new URL(request.url);
    const id = Number(urlObj.searchParams.get('id'));
    if (!id) {
      return jsonResponse({ ok: false, error: 'Valid slide ID is required.' }, 400);
    }

    await env.DB.prepare('DELETE FROM carousel_items WHERE id = ?').bind(id).run();

    const { results: carousel } = await env.DB.prepare(
      'SELECT * FROM carousel_items ORDER BY sort_order ASC, id ASC'
    ).all();

    return jsonResponse({ ok: true, carousel });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || 'Failed to delete slide' }, 500);
  }
}
