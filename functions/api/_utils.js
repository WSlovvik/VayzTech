// Shared utilities & automatic D1 schema initialization for VayzTech

export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

export async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:vayztech:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generateRandomHex(bytes = 24) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getCookie(request, name) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(`${name}=`)) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

export async function ensureInitialized(db) {
  if (!db) {
    throw new Error(
      'Cloudflare D1 database binding "DB" is not configured. Please bind a D1 database named DB in Cloudflare Pages Settings -> Functions -> D1 database bindings.'
    );
  }

  // Create tables if they do not exist yet
  await db.batch([
    db.prepare(`
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        title TEXT NOT NULL DEFAULT 'VayzTech',
        handle TEXT NOT NULL DEFAULT '@vayztech',
        bio TEXT NOT NULL DEFAULT 'Next-gen consumer tech, desk architecture & software workflows. Featured on TikTok.',
        avatar_url TEXT NOT NULL DEFAULT '',
        tiktok_url TEXT NOT NULL DEFAULT 'https://www.tiktok.com/@vayztech',
        email TEXT NOT NULL DEFAULT 'hello@vayztech.com',
        theme_default TEXT NOT NULL DEFAULT 'light',
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL DEFAULT '',
        url TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'Featured',
        badge TEXT NOT NULL DEFAULT '',
        icon TEXT NOT NULL DEFAULT 'arrow-up-right',
        clicks INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL DEFAULT 0,
        active INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `),
    db.prepare(`
      INSERT OR IGNORE INTO profile (id, title, handle, bio, avatar_url, tiktok_url, email, theme_default)
      VALUES (
        1,
        'VayzTech',
        '@vayztech',
        'Next-gen consumer tech, desk architecture & software workflows. Featured on TikTok.',
        '',
        'https://www.tiktok.com/@vayztech',
        'hello@vayztech.com',
        'light'
      )
    `),
  ]);

  // Seed initial links if links table is completely empty and no admin has customized it yet
  const countRow = await db.prepare('SELECT COUNT(*) as count FROM links').first();
  const adminCountRow = await db.prepare('SELECT COUNT(*) as count FROM admins').first();

  if (countRow && countRow.count === 0 && adminCountRow && adminCountRow.count === 0) {
    await db.batch([
      db.prepare(`
        INSERT INTO links (title, subtitle, url, category, badge, icon, clicks, sort_order, active)
        VALUES ('2026 Desk Setup & Gear List', 'Complete breakdown of monitors, peripherals, and lighting', 'https://www.tiktok.com/@vayztech', 'Hardware', 'Updated', 'monitor', 142, 1, 1)
      `),
      db.prepare(`
        INSERT INTO links (title, subtitle, url, category, badge, icon, clicks, sort_order, active)
        VALUES ('Top 5 AI & Productivity Apps', 'Tools featured in this week''s TikTok deep-dive', 'https://www.tiktok.com/@vayztech', 'Software', 'New', 'cpu', 98, 2, 1)
      `),
      db.prepare(`
        INSERT INTO links (title, subtitle, url, category, badge, icon, clicks, sort_order, active)
        VALUES ('Minimalist Wallpaper Pack (Monochrome)', 'High-resolution 6K desktop & mobile backgrounds', 'https://www.tiktok.com/@vayztech', 'Downloads', 'Free', 'layers', 215, 3, 1)
      `),
      db.prepare(`
        INSERT INTO links (title, subtitle, url, category, badge, icon, clicks, sort_order, active)
        VALUES ('Sponsorships & Tech Reviews', 'Media kit, benchmarks, and collaboration inquiries', 'mailto:hello@vayztech.com', 'Contact', '', 'mail', 34, 4, 1)
      `),
    ]);
  }

  // Ensure default admin exists if no admin is in the DB yet (default: admin / admin123)
  if (adminCountRow && adminCountRow.count === 0) {
    const salt = generateRandomHex(16);
    const passwordHash = await hashPassword('admin123', salt);
    await db
      .prepare('INSERT OR IGNORE INTO admins (username, password_hash, salt) VALUES (?, ?, ?)')
      .bind('admin', passwordHash, salt)
      .run();
  }
}

export async function verifyAdminSession(request, db) {
  const authHeader = request.headers.get('Authorization') || '';
  let token = null;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  }
  if (!token) {
    token = getCookie(request, 'vayz_session');
  }
  if (!token) return null;

  const now = Math.floor(Date.now() / 1000);
  const session = await db
    .prepare('SELECT token, username, expires_at FROM sessions WHERE token = ? AND expires_at > ?')
    .bind(token, now)
    .first();

  return session || null;
}
