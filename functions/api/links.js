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
    const subtitle = (body.subtitle || '').trim();
    const url = (body.url || '').trim();
    const category_id = Number(body.category_id || 1);
    const category = (body.category || 'Hardware').trim();
    const image_url = (body.image_url || '').trim();
    const badge = (body.badge || '').trim();
    const icon = (body.icon || 'arrow-up-right').trim();
    const active = body.active === false || body.active === 0 ? 0 : 1;

    if (!title || !url) {
      return jsonResponse({ ok: false, error: 'Title and URL are required.' }, 400);
    }

    const maxRow = await env.DB.prepare(
      'SELECT COALESCE(MAX(sort_order), 0) as maxOrder FROM links'
    ).first();
    const sort_order =
      typeof body.sort_order === 'number' ? body.sort_order : (maxRow?.maxOrder || 0) + 1;

    await env.DB.prepare(
      `INSERT INTO links (title, subtitle, url, category_id, category, image_url, badge, icon, sort_order, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(title, subtitle, url, category_id, category, image_url, badge, icon, sort_order, active)
      .run();

    const { results: links } = await env.DB.prepare(
      'SELECT * FROM links ORDER BY sort_order ASC, id ASC'
    ).all();

    return jsonResponse({ ok: true, links });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || 'Failed to create link' }, 500);
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
        env.DB.prepare('UPDATE links SET sort_order = ? WHERE id = ?').bind(idx + 1, item.id)
      );
      if (statements.length > 0) {
        await env.DB.batch(statements);
      }
      const { results: links } = await env.DB.prepare(
        'SELECT * FROM links ORDER BY sort_order ASC, id ASC'
      ).all();
      return jsonResponse({ ok: true, links });
    }

    const id = Number(body.id);
    if (!id) {
      return jsonResponse({ ok: false, error: 'Link ID is required.' }, 400);
    }

    const title = (body.title || '').trim();
    const subtitle = (body.subtitle || '').trim();
    const url = (body.url || '').trim();
    const category_id = Number(body.category_id || 1);
    const category = (body.category || 'Hardware').trim();
    const image_url = (body.image_url || '').trim();
    const badge = (body.badge || '').trim();
    const icon = (body.icon || 'arrow-up-right').trim();
    const active = body.active === false || body.active === 0 ? 0 : 1;
    const sort_order = Number(body.sort_order || 1);

    await env.DB.prepare(
      `UPDATE links
       SET title = ?, subtitle = ?, url = ?, category_id = ?, category = ?, image_url = ?, badge = ?, icon = ?, sort_order = ?, active = ?
       WHERE id = ?`
    )
      .bind(
        title,
        subtitle,
        url,
        category_id,
        category,
        image_url,
        badge,
        icon,
        sort_order,
        active,
        id
      )
      .run();

    const { results: links } = await env.DB.prepare(
      'SELECT * FROM links ORDER BY sort_order ASC, id ASC'
    ).all();

    return jsonResponse({ ok: true, links });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || 'Failed to update link' }, 500);
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
      return jsonResponse({ ok: false, error: 'Valid link ID is required.' }, 400);
    }

    await env.DB.prepare('DELETE FROM links WHERE id = ?').bind(id).run();

    const { results: links } = await env.DB.prepare(
      'SELECT * FROM links ORDER BY sort_order ASC, id ASC'
    ).all();

    return jsonResponse({ ok: true, links });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || 'Failed to delete link' }, 500);
  }
}
