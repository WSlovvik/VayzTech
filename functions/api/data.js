import { ensureInitialized, jsonResponse, verifyAdminSession } from './_utils.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    await ensureInitialized(env.DB);

    const session = await verifyAdminSession(request, env.DB);
    const isAdmin = Boolean(session);

    const profile = await env.DB.prepare('SELECT * FROM profile WHERE id = 1').first();

    let categoriesQuery = 'SELECT * FROM categories WHERE active = 1 ORDER BY sort_order ASC, id ASC';
    let linksQuery = 'SELECT * FROM links WHERE active = 1 ORDER BY sort_order ASC, id ASC';
    if (isAdmin) {
      categoriesQuery = 'SELECT * FROM categories ORDER BY sort_order ASC, id ASC';
      linksQuery = 'SELECT * FROM links ORDER BY sort_order ASC, id ASC';
    }

    const { results: categories } = await env.DB.prepare(categoriesQuery).all();
    const { results: links } = await env.DB.prepare(linksQuery).all();

    return jsonResponse({
      ok: true,
      dbConnected: true,
      isAdmin,
      adminUser: session ? session.username : null,
      profile,
      categories: categories || [],
      links: links || [],
    });
  } catch (err) {
    return jsonResponse(
      {
        ok: false,
        dbConnected: false,
        error: err.message || 'Database error',
      },
      500
    );
  }
}
