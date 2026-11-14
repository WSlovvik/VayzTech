import { onRequestGet as dataGet } from './functions/api/data.js';
import { onRequestGet as authGet, onRequestPost as authPost } from './functions/api/auth.js';
import { onRequestPut as profilePut } from './functions/api/profile.js';
import {
  onRequestPost as linksPost,
  onRequestPut as linksPut,
  onRequestDelete as linksDelete,
} from './functions/api/links.js';
import { onRequestPost as clickPost } from './functions/api/click.js';
import { jsonResponse } from './functions/api/_utils.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method.toUpperCase();
    const context = { request, env, ctx };

    // Handle API routes
    if (path === '/api/data' && method === 'GET') {
      return dataGet(context);
    }
    if (path === '/api/auth') {
      if (method === 'GET') return authGet(context);
      if (method === 'POST') return authPost(context);
    }
    if (path === '/api/profile' && method === 'PUT') {
      return profilePut(context);
    }
    if (path === '/api/links') {
      if (method === 'POST') return linksPost(context);
      if (method === 'PUT') return linksPut(context);
      if (method === 'DELETE') return linksDelete(context);
    }
    if (path === '/api/click' && method === 'POST') {
      return clickPost(context);
    }
    if (path.startsWith('/api/')) {
      return jsonResponse({ ok: false, error: 'Not found' }, 404);
    }

    // Serve static assets (index.html, styles.css, app.js)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
