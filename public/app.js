// VayzTech — Frontend Application & Cloudflare D1 Admin Integration

const DEFAULT_FALLBACK_STATE = {
  dbConnected: false,
  isAdmin: false,
  adminUser: null,
  profile: {
    title: 'VayzTech',
    handle: '@vayztech',
    bio: 'Next-gen consumer tech, desk architecture & software workflows. Featured on TikTok.',
    avatar_url: '',
    tiktok_url: 'https://www.tiktok.com/@vayztech',
    email: 'hello@vayztech.com',
    theme_default: 'light',
  },
  links: [
    {
      id: 1,
      title: '2026 Desk Setup & Gear List',
      subtitle: 'Complete breakdown of monitors, peripherals, and lighting',
      url: 'https://www.tiktok.com/@vayztech',
      category: 'Hardware',
      badge: 'Updated',
      icon: 'monitor',
      clicks: 142,
      sort_order: 1,
      active: 1,
    },
    {
      id: 2,
      title: 'Top 5 AI & Productivity Apps',
      subtitle: "Tools featured in this week's TikTok deep-dive",
      url: 'https://www.tiktok.com/@vayztech',
      category: 'Software',
      badge: 'New',
      icon: 'cpu',
      clicks: 98,
      sort_order: 2,
      active: 1,
    },
    {
      id: 3,
      title: 'Minimalist Wallpaper Pack (Monochrome)',
      subtitle: 'High-resolution 6K desktop & mobile backgrounds',
      url: 'https://www.tiktok.com/@vayztech',
      category: 'Downloads',
      badge: 'Free',
      icon: 'layers',
      clicks: 215,
      sort_order: 3,
      active: 1,
    },
    {
      id: 4,
      title: 'Sponsorships & Tech Reviews',
      subtitle: 'Media kit, benchmarks, and collaboration inquiries',
      url: 'mailto:hello@vayztech.com',
      category: 'Contact',
      badge: '',
      icon: 'mail',
      clicks: 34,
      sort_order: 4,
      active: 1,
    },
  ],
};

let appState = structuredClone(DEFAULT_FALLBACK_STATE);
let selectedCategory = 'all';
let sessionToken = localStorage.getItem('vayz_token') || '';

// Monochrome SVG Icon Library
const ICONS = {
  'arrow-up-right': `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>`,
  monitor: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
  cpu: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`,
  layers: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`,
  code: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  'shopping-bag': `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
};

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (sessionToken) {
    headers['Authorization'] = `Bearer ${sessionToken}`;
  }
  return headers;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2600);
}

// Theme Handling
function applyTheme(theme) {
  const normalized = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', normalized);
  const metaTheme = document.getElementById('meta-theme-color');
  if (metaTheme) {
    metaTheme.setAttribute('content', normalized === 'dark' ? '#1C1C1E' : '#FFFFFF');
  }
}

function initTheme(defaultTheme = 'light') {
  const saved = localStorage.getItem('vayz_theme');
  applyTheme(saved || defaultTheme || 'light');
}

// Fetch Data from Cloudflare Pages Function + D1 (with Local Demo Fallback)
async function fetchAppData() {
  try {
    const res = await fetch('/api/data', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('API unavailable');
    const data = await res.json();
    if (data && data.ok) {
      appState = {
        dbConnected: true,
        isAdmin: Boolean(data.isAdmin),
        adminUser: data.adminUser || null,
        profile: data.profile || DEFAULT_FALLBACK_STATE.profile,
        links: Array.isArray(data.links) ? data.links : [],
      };
      if (!localStorage.getItem('vayz_theme') && appState.profile.theme_default) {
        applyTheme(appState.profile.theme_default);
      }
      renderAll();
      return;
    }
  } catch (_) {
    // Fallback to localStorage / default state when previewed as static files without D1 bound yet
    const localSaved = localStorage.getItem('vayz_local_state');
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        appState = { ...DEFAULT_FALLBACK_STATE, ...parsed, dbConnected: false };
      } catch {
        appState = structuredClone(DEFAULT_FALLBACK_STATE);
      }
    }
    appState.isAdmin = localStorage.getItem('vayz_local_admin') === 'true';
    renderAll();
  }
}

function saveLocalFallback() {
  localStorage.setItem(
    'vayz_local_state',
    JSON.stringify({
      profile: appState.profile,
      links: appState.links,
    })
  );
}

function getInitials(title) {
  const clean = (title || 'VT').trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

// Render Public Page & Admin Console
function renderAll() {
  const { profile, links, isAdmin } = appState;

  // Top bar & title
  document.title = `${profile.title} — Links & Curated Tech`;
  document.getElementById('top-handle').textContent = profile.handle || '@vayztech';
  document.getElementById('profile-title').textContent = profile.title || 'VayzTech';
  document.getElementById('profile-handle').textContent = profile.handle || '@vayztech';
  document.getElementById('profile-bio').textContent = profile.bio || '';
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Avatar
  const avatarImg = document.getElementById('profile-avatar');
  const avatarFallback = document.getElementById('avatar-fallback');
  const avatarInitials = document.getElementById('avatar-initials');

  if (profile.avatar_url) {
    avatarImg.src = profile.avatar_url;
    avatarImg.classList.remove('hidden');
    avatarFallback.classList.add('hidden');
  } else {
    avatarImg.classList.add('hidden');
    avatarFallback.classList.remove('hidden');
    avatarInitials.textContent = getInitials(profile.title);
  }

  // TikTok & Mail links (Header + Footer)
  const tiktokHref = profile.tiktok_url || 'https://www.tiktok.com/@vayztech';
  const emailHref = profile.email
    ? profile.email.startsWith('mailto:')
      ? profile.email
      : `mailto:${profile.email}`
    : 'mailto:hello@vayztech.com';

  document.getElementById('social-tiktok').href = tiktokHref;
  document.getElementById('footer-tiktok').href = tiktokHref;
  document.getElementById('social-email').href = emailHref;
  document.getElementById('footer-email').href = emailHref;

  renderCategories(links);
  renderPublicLinks(links);
  renderAdminView();
}

function renderCategories(links) {
  const visibleLinks = links.filter((l) => Number(l.active) !== 0);
  const categories = Array.from(
    new Set(visibleLinks.map((l) => (l.category || '').trim()).filter(Boolean))
  );

  const navWrap = document.getElementById('category-nav-wrap');
  const segmented = document.getElementById('category-segmented');

  if (categories.length <= 1) {
    navWrap.classList.add('hidden');
    selectedCategory = 'all';
    return;
  }

  navWrap.classList.remove('hidden');
  const allButtons = ['all', ...categories];

  segmented.innerHTML = allButtons
    .map((cat) => {
      const isActive = selectedCategory === cat ? 'active' : '';
      const label = cat === 'all' ? 'All' : escapeHtml(cat);
      return `<button type="button" class="segment-btn ${isActive}" data-category="${escapeHtml(cat)}">${label}</button>`;
    })
    .join('');

  segmented.querySelectorAll('.segment-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.getAttribute('data-category') || 'all';
      renderCategories(appState.links);
      renderPublicLinks(appState.links);
    });
  });
}

function renderPublicLinks(links) {
  const container = document.getElementById('links-list');
  const visible = links
    .filter((l) => Number(l.active) !== 0)
    .filter((l) => selectedCategory === 'all' || (l.category || '').trim() === selectedCategory);

  if (visible.length === 0) {
    container.innerHTML = `<div class="empty-state">No links available in this category yet.</div>`;
    return;
  }

  container.innerHTML = visible
    .map((link) => {
      const iconSvg = ICONS[link.icon] || ICONS['arrow-up-right'];
      const badgeHtml = link.badge
        ? `<span class="link-badge">${escapeHtml(link.badge)}</span>`
        : '';
      const subtitleHtml = link.subtitle
        ? `<p class="link-subtitle">${escapeHtml(link.subtitle)}</p>`
        : '';

      return `
        <a href="${escapeHtml(link.url)}"
           target="_blank"
           rel="noopener noreferrer"
           class="link-card"
           data-link-id="${link.id}">
          <div class="link-card-left">
            <div class="link-icon-box" aria-hidden="true">
              ${iconSvg}
            </div>
            <div class="link-text-group">
              <div class="link-title-line">
                <span class="link-title">${escapeHtml(link.title)}</span>
                ${badgeHtml}
              </div>
              ${subtitleHtml}
            </div>
          </div>
          <div class="link-card-right" aria-hidden="true">
            ${ICONS['arrow-up-right']}
          </div>
        </a>
      `;
    })
    .join('');

  // Click tracking
  container.querySelectorAll('.link-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = Number(card.getAttribute('data-link-id'));
      if (!id) return;
      if (appState.dbConnected) {
        fetch('/api/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
          keepalive: true,
        }).catch(() => {});
      } else {
        const found = appState.links.find((l) => l.id === id);
        if (found) {
          found.clicks = (found.clicks || 0) + 1;
          saveLocalFallback();
        }
      }
    });
  });
}

// ============================================================================
// Admin Console Logic
// ============================================================================
function renderAdminView() {
  const loginView = document.getElementById('admin-login-view');
  const dashboardView = document.getElementById('admin-dashboard-view');
  const eyebrow = document.getElementById('modal-eyebrow');

  if (!appState.isAdmin) {
    loginView.classList.remove('hidden');
    dashboardView.classList.add('hidden');
    eyebrow.textContent = appState.dbConnected ? 'CLOUDFLARE D1 AUTH' : 'ADMIN PORTAL';
    return;
  }

  loginView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
  eyebrow.textContent = appState.dbConnected
    ? `D1 CONNECTED • ${(appState.adminUser || 'ADMIN').toUpperCase()}`
    : 'LOCAL PREVIEW MODE (BIND D1 FOR CLOUD SYNC)';

  // Populate Profile Form
  const p = appState.profile;
  document.getElementById('edit-title').value = p.title || '';
  document.getElementById('edit-handle').value = p.handle || '';
  document.getElementById('edit-bio').value = p.bio || '';
  document.getElementById('edit-tiktok').value = p.tiktok_url || '';
  document.getElementById('edit-email').value = p.email || '';
  document.getElementById('edit-avatar').value = p.avatar_url || '';
  document.getElementById('edit-theme').value = p.theme_default || 'light';

  document.getElementById('sec-username').value = appState.adminUser || 'admin';

  // Render Admin Links List
  const adminList = document.getElementById('admin-links-list');
  if (appState.links.length === 0) {
    adminList.innerHTML = `<div class="empty-state">No links yet. Click "+ Add Link" to create your first item.</div>`;
    return;
  }

  adminList.innerHTML = appState.links
    .map((l, idx) => {
      const inactiveClass = Number(l.active) === 0 ? 'is-inactive' : '';
      const statusLabel = Number(l.active) === 0 ? 'Hidden' : `${l.clicks || 0} clicks`;
      return `
        <div class="admin-link-row ${inactiveClass}">
          <div class="admin-link-info">
            <div class="admin-link-title">
              <span>${escapeHtml(l.title)}</span>
              ${l.badge ? `<span class="link-badge">${escapeHtml(l.badge)}</span>` : ''}
            </div>
            <div class="admin-link-meta">
              ${escapeHtml(l.category || 'Featured')} &bull; ${statusLabel} &bull; ${escapeHtml(l.url)}
            </div>
          </div>
          <div class="admin-link-actions">
            <button type="button" class="btn-ghost-sm" data-action="up" data-idx="${idx}" title="Move up">&uarr;</button>
            <button type="button" class="btn-ghost-sm" data-action="down" data-idx="${idx}" title="Move down">&darr;</button>
            <button type="button" class="btn-ghost-sm" data-action="edit" data-id="${l.id}">Edit</button>
            <button type="button" class="btn-ghost-sm" data-action="delete" data-id="${l.id}">Delete</button>
          </div>
        </div>
      `;
    })
    .join('');

  adminList.querySelectorAll('button[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const id = Number(btn.getAttribute('data-id'));
      const idx = Number(btn.getAttribute('data-idx'));
      if (action === 'edit') openLinkEditor(id);
      if (action === 'delete') handleDeleteLink(id);
      if (action === 'up') handleMoveLink(idx, -1);
      if (action === 'down') handleMoveLink(idx, 1);
    });
  });
}

function openLinkEditor(linkId = null) {
  const form = document.getElementById('link-editor-form');
  const heading = document.getElementById('link-editor-heading');
  form.classList.remove('hidden');

  if (!linkId) {
    heading.textContent = 'New Link';
    document.getElementById('link-id').value = '';
    document.getElementById('link-title').value = '';
    document.getElementById('link-subtitle').value = '';
    document.getElementById('link-url').value = '';
    document.getElementById('link-category').value = 'Featured';
    document.getElementById('link-badge').value = '';
    document.getElementById('link-icon').value = 'arrow-up-right';
    document.getElementById('link-active').checked = true;
    return;
  }

  const item = appState.links.find((l) => Number(l.id) === Number(linkId));
  if (!item) return;

  heading.textContent = 'Edit Link';
  document.getElementById('link-id').value = item.id;
  document.getElementById('link-title').value = item.title || '';
  document.getElementById('link-subtitle').value = item.subtitle || '';
  document.getElementById('link-url').value = item.url || '';
  document.getElementById('link-category').value = item.category || 'Featured';
  document.getElementById('link-badge').value = item.badge || '';
  document.getElementById('link-icon').value = item.icon || 'arrow-up-right';
  document.getElementById('link-active').checked = Number(item.active) !== 0;
}

async function handleDeleteLink(id) {
  if (appState.dbConnected) {
    const res = await fetch(`/api/links?id=${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (data.ok) {
      appState.links = data.links;
      renderAll();
      showToast('Link deleted');
    }
  } else {
    appState.links = appState.links.filter((l) => Number(l.id) !== Number(id));
    saveLocalFallback();
    renderAll();
    showToast('Link deleted');
  }
}

async function handleMoveLink(index, delta) {
  const targetIndex = index + delta;
  if (targetIndex < 0 || targetIndex >= appState.links.length) return;

  const copy = [...appState.links];
  const [moved] = copy.splice(index, 1);
  copy.splice(targetIndex, 0, moved);
  copy.forEach((item, i) => {
    item.sort_order = i + 1;
  });
  appState.links = copy;

  if (appState.dbConnected) {
    const res = await fetch('/api/links', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        order: copy.map((item) => ({ id: item.id })),
      }),
    });
    const data = await res.json();
    if (data.ok) {
      appState.links = data.links;
    }
  } else {
    saveLocalFallback();
  }
  renderAll();
}

// ============================================================================
// Event Listeners Setup
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme('light');
  fetchAppData();

  // Theme Toggle
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('vayz_theme', next);
    applyTheme(next);
  });

  // Share Page Button
  document.getElementById('share-btn').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Page link copied to clipboard');
    } catch {
      showToast(window.location.href);
    }
  });

  // Open / Close Admin Modal (via #admin URL hash or Shift + Alt + A shortcut)
  const modal = document.getElementById('admin-modal');
  function openAdminModal() {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    renderAdminView();
  }

  function closeAdminModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    if (window.location.hash === '#admin' || window.location.hash === '#login') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }

  if (window.location.hash === '#admin' || window.location.hash === '#login') {
    openAdminModal();
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#admin' || window.location.hash === '#login') {
      openAdminModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      openAdminModal();
    }
  });

  document.getElementById('modal-close').addEventListener('click', closeAdminModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeAdminModal();
    }
  });

  // Admin Tabs switching
  document.querySelectorAll('.admin-tab').forEach((tabBtn) => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach((b) => b.classList.remove('active'));
      tabBtn.classList.add('active');
      const target = tabBtn.getAttribute('data-tab');
      document.getElementById('tab-links').classList.toggle('hidden', target !== 'links');
      document.getElementById('tab-profile').classList.toggle('hidden', target !== 'profile');
      document.getElementById('tab-security').classList.toggle('hidden', target !== 'security');
    });
  });

  // Login Form
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    errorEl.classList.add('hidden');

    if (appState.dbConnected) {
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', username, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          errorEl.textContent = data.error || 'Invalid credentials.';
          errorEl.classList.remove('hidden');
          return;
        }
        sessionToken = data.token || '';
        localStorage.setItem('vayz_token', sessionToken);
        await fetchAppData();
        showToast('Signed in to Cloudflare D1');
      } catch (err) {
        errorEl.textContent = err.message || 'Login failed';
        errorEl.classList.remove('hidden');
      }
    } else {
      // Local fallback login
      const savedPass = localStorage.getItem('vayz_local_pass') || 'admin123';
      const savedUser = localStorage.getItem('vayz_local_user') || 'admin';
      if (username.toLowerCase() === savedUser.toLowerCase() && password === savedPass) {
        appState.isAdmin = true;
        appState.adminUser = savedUser;
        localStorage.setItem('vayz_local_admin', 'true');
        renderAll();
        showToast('Signed in');
      } else {
        errorEl.textContent = 'Invalid username or password.';
        errorEl.classList.remove('hidden');
      }
    }
  });

  // Logout
  document.getElementById('logout-btn').addEventListener('click', async () => {
    if (appState.dbConnected) {
      await fetch('/api/auth', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: 'logout' }),
      }).catch(() => {});
    }
    sessionToken = '';
    localStorage.removeItem('vayz_token');
    localStorage.removeItem('vayz_local_admin');
    appState.isAdmin = false;
    await fetchAppData();
    showToast('Signed out');
  });

  // New / Cancel Link Editor
  document.getElementById('new-link-btn').addEventListener('click', () => openLinkEditor(null));
  document.getElementById('cancel-link-edit').addEventListener('click', () => {
    document.getElementById('link-editor-form').classList.add('hidden');
  });

  // Save Link Form
  document.getElementById('link-editor-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('link-id').value;
    const payload = {
      id: id ? Number(id) : undefined,
      title: document.getElementById('link-title').value.trim(),
      subtitle: document.getElementById('link-subtitle').value.trim(),
      url: document.getElementById('link-url').value.trim(),
      category: document.getElementById('link-category').value.trim() || 'Featured',
      badge: document.getElementById('link-badge').value.trim(),
      icon: document.getElementById('link-icon').value,
      active: document.getElementById('link-active').checked ? 1 : 0,
    };

    if (appState.dbConnected) {
      const res = await fetch('/api/links', {
        method: id ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        appState.links = data.links;
        document.getElementById('link-editor-form').classList.add('hidden');
        renderAll();
        showToast(id ? 'Link updated' : 'Link added');
      }
    } else {
      if (id) {
        const idx = appState.links.findIndex((l) => Number(l.id) === Number(id));
        if (idx !== -1) {
          appState.links[idx] = { ...appState.links[idx], ...payload };
        }
      } else {
        const nextId = appState.links.reduce((max, l) => Math.max(max, Number(l.id) || 0), 0) + 1;
        appState.links.push({
          ...payload,
          id: nextId,
          clicks: 0,
          sort_order: appState.links.length + 1,
        });
      }
      saveLocalFallback();
      document.getElementById('link-editor-form').classList.add('hidden');
      renderAll();
      showToast(id ? 'Link updated' : 'Link added');
    }
  });

  // Save Profile Form
  document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      title: document.getElementById('edit-title').value.trim(),
      handle: document.getElementById('edit-handle').value.trim(),
      bio: document.getElementById('edit-bio').value.trim(),
      tiktok_url: document.getElementById('edit-tiktok').value.trim(),
      email: document.getElementById('edit-email').value.trim(),
      avatar_url: document.getElementById('edit-avatar').value.trim(),
      theme_default: document.getElementById('edit-theme').value,
    };

    if (appState.dbConnected) {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        appState.profile = data.profile;
        renderAll();
        showToast('Profile saved to Cloudflare D1');
      }
    } else {
      appState.profile = { ...appState.profile, ...payload };
      saveLocalFallback();
      renderAll();
      showToast('Profile updated');
    }
  });

  // Security / Password Form
  document.getElementById('security-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newUsername = document.getElementById('sec-username').value.trim();
    const currentPassword = document.getElementById('sec-current-password').value;
    const newPassword = document.getElementById('sec-new-password').value;

    if (appState.dbConnected) {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: 'change_password',
          newUsername,
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        appState.adminUser = data.username;
        document.getElementById('sec-current-password').value = '';
        document.getElementById('sec-new-password').value = '';
        renderAll();
        showToast('Credentials updated in D1');
      } else {
        showToast(data.error || 'Failed to update credentials');
      }
    } else {
      localStorage.setItem('vayz_local_user', newUsername);
      localStorage.setItem('vayz_local_pass', newPassword);
      appState.adminUser = newUsername;
      document.getElementById('sec-current-password').value = '';
      document.getElementById('sec-new-password').value = '';
      renderAll();
      showToast('Credentials updated');
    }
  });
});
