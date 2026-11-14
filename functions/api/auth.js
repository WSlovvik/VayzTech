import {
  ensureInitialized,
  generateRandomHex,
  hashPassword,
  jsonResponse,
  verifyAdminSession,
  getCookie,
} from './_utils.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    await ensureInitialized(env.DB);
    const session = await verifyAdminSession(request, env.DB);
    if (!session) {
      return jsonResponse({ authenticated: false }, 200);
    }
    return jsonResponse({
      authenticated: true,
      username: session.username,
      expiresAt: session.expires_at,
    });
  } catch (err) {
    return jsonResponse({ authenticated: false, error: err.message }, 500);
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    await ensureInitialized(env.DB);
    const body = await request.json();
    const action = body.action || 'login';

    if (action === 'logout') {
      const token = getCookie(request, 'vayz_session');
      if (token) {
        await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
      }
      return jsonResponse(
        { ok: true },
        200,
        {
          'Set-Cookie': 'vayz_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
        }
      );
    }

    if (action === 'change_password') {
      const session = await verifyAdminSession(request, env.DB);
      if (!session) {
        return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
      }

      const { currentPassword, newUsername, newPassword } = body;
      if (!currentPassword || !newPassword || newPassword.length < 6) {
        return jsonResponse(
          { ok: false, error: 'New password must be at least 6 characters.' },
          400
        );
      }

      const admin = await env.DB.prepare('SELECT * FROM admins WHERE username = ?')
        .bind(session.username)
        .first();
      if (!admin) {
        return jsonResponse({ ok: false, error: 'Admin account not found.' }, 404);
      }

      const currentHash = await hashPassword(currentPassword, admin.salt);
      if (currentHash !== admin.password_hash) {
        return jsonResponse({ ok: false, error: 'Current password is incorrect.' }, 403);
      }

      const newSalt = generateRandomHex(16);
      const newHash = await hashPassword(newPassword, newSalt);
      const updatedUsername = (newUsername || admin.username).trim().toLowerCase();

      await env.DB.prepare(
        'UPDATE admins SET username = ?, password_hash = ?, salt = ? WHERE id = ?'
      )
        .bind(updatedUsername, newHash, newSalt, admin.id)
        .run();

      await env.DB.prepare('UPDATE sessions SET username = ? WHERE username = ?')
        .bind(updatedUsername, session.username)
        .run();

      return jsonResponse({
        ok: true,
        username: updatedUsername,
        message: 'Credentials updated in Cloudflare D1.',
      });
    }

    // Default: login
    const username = (body.username || '').trim().toLowerCase();
    const password = body.password || '';

    if (!username || !password) {
      return jsonResponse({ ok: false, error: 'Username and password are required.' }, 400);
    }

    const admin = await env.DB.prepare('SELECT * FROM admins WHERE LOWER(username) = ?')
      .bind(username)
      .first();

    if (!admin) {
      return jsonResponse({ ok: false, error: 'Invalid credentials.' }, 401);
    }

    const candidateHash = await hashPassword(password, admin.salt);
    if (candidateHash !== admin.password_hash) {
      return jsonResponse({ ok: false, error: 'Invalid credentials.' }, 401);
    }

    const token = generateRandomHex(32);
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + 60 * 60 * 24 * 14; // 14 days

    // Clean up expired sessions
    await env.DB.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(now).run();

    await env.DB.prepare(
      'INSERT INTO sessions (token, username, expires_at) VALUES (?, ?, ?)'
    )
      .bind(token, admin.username, expiresAt)
      .run();

    return jsonResponse(
      {
        ok: true,
        token,
        username: admin.username,
      },
      200,
      {
        'Set-Cookie': `vayz_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 14}`,
      }
    );
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || 'Authentication error' }, 500);
  }
}
