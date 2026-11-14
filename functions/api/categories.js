import { ensureInitialized, jsonResponse, verifyAdminSession } from './_utils.js';

function toSlug(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    await ensureInitialized(env.DB);
    const session = await verifyAdminSession(request, env.DB);
    if (!session) {
      return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
    }

    const body = await request.json();
    const name = (body.name || '').trim();
    const url = (body.url || '').trim();
    const display_type = ['filter', 'link', 'section'].includes(body.display_type)
      ? body.display_type
      : url
      ? 'link'
      : 'filter';
    const active = body.active === false || body.active === 0 ? 0 : 1;

    if (!name) {
      return jsonResponse({ ok: false, error: 'Category name is required.' }, 400);
    }

    const maxRow = await env.DB.prepare(
      'SELECT COALESCE(MAX(sort_order), 0) as maxOrder FROM categories'
    ).first();
    const sort_order = (maxRow?.maxOrder || 0) + 1;
    const slug = toSlug(name);

    await env.DB.prepare(
      'INSERT INTO categories (name, slug, url, display_type, sort_order, active) VALUES (?, ?, ?, ?, ?, ?)'
    )
      .bind(name, slug, url, display_type, sort_order, active)
      .run();

    const { results: categories } = await env.DB.prepare(
      'SELECT * FROM categories ORDER BY sort_order ASC, id ASC'
    ).all();

    return jsonResponse({ ok: true, categories });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || 'Failed to create category' }, 500);
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
        env.DB.prepare('UPDATE categories SET sort_order = ? WHERE id = ?').bind(idx + 1, item.id)
      );
      if (statements.length > 0) {
        await env.DB.batch(statements);
      }
      const { results: categories } = await env.DB.prepare(
        'SELECT * FROM categories ORDER BY sort_order ASC, id ASC'
      ).all();
      return jsonResponse({ ok: true, categories });
    }

    const id = Number(body.id);
    if (!id) {
      return jsonResponse({ ok: false, error: 'Category ID is required.' }, 400);
    }

    const name = (body.name || '').trim();
    const url = (body.url || '').trim();
    const display_type = ['filter', 'link', 'section'].includes(body.display_type)
      ? body.display_type
      : url
      ? 'link'
      : 'filter';
    const active = body.active === false || body.active === 0 ? 0 : 1;
    const slug = toSlug(name);

    await env.DB.prepare(
      'UPDATE categories SET name = ?, slug = ?, url = ?, display_type = ?, active = ? WHERE id = ?'
    )
      .bind(name, slug, url, display_type, active, id)
      .run();

    await env.DB.prepare('UPDATE links SET category = ? WHERE category_id = ?')
      .bind(name, id)
      .run();

    const { results: categories } = await env.DB.prepare(
      'SELECT * FROM categories ORDER BY sort_order ASC, id ASC'
    ).all();
    const { results: links } = await env.DB.prepare(
      'SELECT * FROM links ORDER BY sort_order ASC, id ASC'
    ).all();

    return jsonResponse({ ok: true, categories, links });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || 'Failed to update category' }, 500);
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
      return jsonResponse({ ok: false, error: 'Valid category ID is required.' }, 400);
    }

    await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
    await env.DB.prepare('DELETE FROM links WHERE category_id = ?').bind(id).run();

    const { results: categories } = await env.DB.prepare(
      'SELECT * FROM categories ORDER BY sort_order ASC, id ASC'
    ).all();
    const { results: links } = await env.DB.prepare(
      'SELECT * FROM links ORDER BY sort_order ASC, id ASC'
    ).all();

    return jsonResponse({ ok: true, categories, links });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || 'Failed to delete category' }, 500);
  }
}
