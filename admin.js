// VayzTech Visual Studio — Full-Page Graphical Creator (/admin.html)

const DEFAULT_FALLBACK_STATE = {
  dbConnected: false,
  isAdmin: false,
  adminUser: 'admin',
  profile: {
    title: 'VayzTech',
    handle: '@vayztech',
    bio: 'Next-gen consumer tech, desk architecture & software workflows. Featured on TikTok.',
    avatar_url: '',
    tiktok_url: 'https://www.tiktok.com/@vayztech',
    email: 'hello@vayztech.com',
    theme_default: 'light',
  },
  categories: [
    { id: 1, name: 'Hardware', slug: 'hardware', url: '', sort_order: 1, active: 1 },
    { id: 2, name: 'Software', slug: 'software', url: '', sort_order: 2, active: 1 },
    { id: 3, name: 'Wallpapers', slug: 'wallpapers', url: '', sort_order: 3, active: 1 },
    {
      id: 4,
      name: 'TikTok Feed ↗',
      slug: 'tiktok-feed',
      url: 'https://www.tiktok.com/@vayztech',
      sort_order: 4,
      active: 1,
    },
  ],
  links: [
    {
      id: 1,
      title: '2026 Desk Setup & Gear List',
      subtitle: 'Complete breakdown of monitors, peripherals, and lighting',
      url: 'https://www.tiktok.com/@vayztech',
      category_id: 1,
      category: 'Hardware',
      image_url: '',
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
      category_id: 2,
      category: 'Software',
      image_url: '',
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
      category_id: 3,
      category: 'Wallpapers',
      image_url: '',
      badge: 'Free',
      icon: 'layers',
      clicks: 215,
      sort_order: 3,
      active: 1,
    },
  ],
};

let studioState = structuredClone(DEFAULT_FALLBACK_STATE);
let selectedCatId = 'all';
let previewCatId = 'all';
let sessionToken = localStorage.getItem('vayz_token') || '';

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

function applyTheme(theme) {
  const normalized = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', normalized);
  const metaTheme = document.getElementById('meta-theme-color');
  if (metaTheme) {
    metaTheme.setAttribute('content', normalized === 'dark' ? '#1C1C1E' : '#FFFFFF');
  }
}

function getInitials(title) {
  const clean = (title || 'VT').trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

// Client-side Image Compressor (resizes uploaded photos to crisp 256x256 WebP/JPEG data URI for Cloudflare D1)
function compressImageFile(file, maxSize = 256, quality = 0.84) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Square center-crop for clean Apple-like thumbnails & avatars
        const minSide = Math.min(width, height);
        const sx = (width - minSide) / 2;
        const sy = (height - minSide) / 2;

        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, maxSize, maxSize);

        const dataUrl = canvas.toDataURL('image/webp', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = ev.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function saveLocalFallback() {
  localStorage.setItem(
    'vayz_local_state',
    JSON.stringify({
      profile: studioState.profile,
      categories: studioState.categories,
      links: studioState.links,
    })
  );
}

async function fetchStudioData() {
  try {
    const res = await fetch('/api/data', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('API unavailable');
    const data = await res.json();
    if (data && data.ok) {
      studioState = {
        dbConnected: true,
        isAdmin: Boolean(data.isAdmin),
        adminUser: data.adminUser || 'admin',
        profile: data.profile || DEFAULT_FALLBACK_STATE.profile,
        categories: Array.isArray(data.categories) ? data.categories : [],
        links: Array.isArray(data.links) ? data.links : [],
      };
      renderStudio();
      return;
    }
  } catch (_) {
    const localSaved = localStorage.getItem('vayz_local_state');
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        studioState = { ...DEFAULT_FALLBACK_STATE, ...parsed, dbConnected: false };
      } catch {
        studioState = structuredClone(DEFAULT_FALLBACK_STATE);
      }
    }
    studioState.isAdmin = localStorage.getItem('vayz_local_admin') === 'true';
    renderStudio();
  }
}

function renderStudio() {
  const loginScreen = document.getElementById('studio-login-screen');
  const workspace = document.getElementById('studio-workspace');
  const logoutBtn = document.getElementById('studio-logout-btn');
  const dbBadge = document.getElementById('studio-db-badge');

  dbBadge.textContent = studioState.dbConnected ? 'D1 Connected' : 'Local Preview';

  if (!studioState.isAdmin) {
    loginScreen.classList.remove('hidden');
    workspace.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    return;
  }

  loginScreen.classList.add('hidden');
  workspace.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');

  renderCategoriesBuilder();
  renderLinksBuilder();
  populateProfileForm();
  renderLivePreview();
}

// ============================================================================
// Step 1: Categories Builder
// ============================================================================
function renderCategoriesBuilder() {
  const listEl = document.getElementById('studio-categories-list');
  const cats = studioState.categories || [];

  const allChip = `
    <div class="cat-chip ${selectedCatId === 'all' ? 'active' : ''}" data-select-cat="all">
      <span class="cat-chip-name">All Categories (${studioState.links.length})</span>
    </div>
  `;

  const catChips = cats
    .map((cat, idx) => {
      const isSelected = String(selectedCatId) === String(cat.id) ? 'active' : '';
      const isLinkCat = Boolean((cat.url || '').trim());
      const count = (studioState.links || []).filter(
        (l) => String(l.category_id) === String(cat.id)
      ).length;

      return `
        <div class="cat-chip ${isSelected} ${isLinkCat ? 'is-link-cat' : ''}" data-select-cat="${cat.id}">
          <div class="cat-chip-main">
            <span class="cat-chip-name">${escapeHtml(cat.name)}</span>
            <span class="cat-chip-meta">${isLinkCat ? 'Direct Link Pill ↗' : `${count} links`}</span>
          </div>
          <div class="cat-chip-actions">
            <button type="button" class="chip-act-btn" data-cat-act="left" data-idx="${idx}" title="Move left">&larr;</button>
            <button type="button" class="chip-act-btn" data-cat-act="right" data-idx="${idx}" title="Move right">&rarr;</button>
            <button type="button" class="chip-act-btn" data-cat-act="edit" data-id="${cat.id}" title="Edit">Edit</button>
            <button type="button" class="chip-act-btn" data-cat-act="delete" data-id="${cat.id}" title="Delete">&times;</button>
          </div>
        </div>
      `;
    })
    .join('');

  listEl.innerHTML = allChip + catChips;

  // Clicking a category selects it to filter/add links inside it
  listEl.querySelectorAll('[data-select-cat]').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      selectedCatId = chip.getAttribute('data-select-cat') || 'all';
      previewCatId = selectedCatId;
      renderCategoriesBuilder();
      renderLinksBuilder();
      renderLivePreview();
    });
  });

  // Category actions (edit, delete, move)
  listEl.querySelectorAll('button[data-cat-act]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const act = btn.getAttribute('data-cat-act');
      const id = Number(btn.getAttribute('data-id'));
      const idx = Number(btn.getAttribute('data-idx'));
      if (act === 'edit') openCategoryEditor(id);
      if (act === 'delete') handleDeleteCategory(id);
      if (act === 'left') handleMoveCategory(idx, -1);
      if (act === 'right') handleMoveCategory(idx, 1);
    });
  });

  // Also refresh category dropdown inside link editor
  const selectEl = document.getElementById('link-category-select');
  const filterCats = cats.filter((c) => !(c.url || '').trim());
  const availableCats = filterCats.length > 0 ? filterCats : cats;
  selectEl.innerHTML = availableCats
    .map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`)
    .join('');
}

function openCategoryEditor(catId = null) {
  const form = document.getElementById('category-form');
  const titleEl = document.getElementById('category-form-title');
  const typeSelect = document.getElementById('cat-type');
  const urlGroup = document.getElementById('cat-url-group');
  form.classList.remove('hidden');

  if (!catId) {
    titleEl.textContent = 'Create Category';
    document.getElementById('cat-id').value = '';
    document.getElementById('cat-name').value = '';
    typeSelect.value = 'filter';
    document.getElementById('cat-url').value = '';
    urlGroup.classList.add('hidden');
    document.getElementById('cat-active').checked = true;
    return;
  }

  const cat = studioState.categories.find((c) => Number(c.id) === Number(catId));
  if (!cat) return;

  titleEl.textContent = 'Edit Category';
  document.getElementById('cat-id').value = cat.id;
  document.getElementById('cat-name').value = cat.name || '';
  const isLink = Boolean((cat.url || '').trim());
  typeSelect.value = isLink ? 'link' : 'filter';
  document.getElementById('cat-url').value = cat.url || '';
  urlGroup.classList.toggle('hidden', !isLink);
  document.getElementById('cat-active').checked = Number(cat.active) !== 0;
}

async function handleDeleteCategory(id) {
  if (studioState.dbConnected) {
    const res = await fetch(`/api/categories?id=${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (data.ok) {
      studioState.categories = data.categories;
      studioState.links = data.links;
    }
  } else {
    studioState.categories = studioState.categories.filter((c) => Number(c.id) !== Number(id));
    studioState.links = studioState.links.filter((l) => Number(l.category_id) !== Number(id));
    saveLocalFallback();
  }
  if (String(selectedCatId) === String(id)) {
    selectedCatId = 'all';
    previewCatId = 'all';
  }
  renderStudio();
  showToast('Category deleted');
}

async function handleMoveCategory(idx, delta) {
  const target = idx + delta;
  if (target < 0 || target >= studioState.categories.length) return;
  const copy = [...studioState.categories];
  const [moved] = copy.splice(idx, 1);
  copy.splice(target, 0, moved);
  studioState.categories = copy;

  if (studioState.dbConnected) {
    const res = await fetch('/api/categories', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ order: copy.map((c) => ({ id: c.id })) }),
    });
    const data = await res.json();
    if (data.ok) studioState.categories = data.categories;
  } else {
    saveLocalFallback();
  }
  renderStudio();
}

// ============================================================================
// Step 2: Links Inside Selected Category Builder
// ============================================================================
function renderLinksBuilder() {
  const heading = document.getElementById('active-cat-heading');
  const listEl = document.getElementById('studio-links-list');

  const selectedCatObj = studioState.categories.find(
    (c) => String(c.id) === String(selectedCatId)
  );

  if (selectedCatObj) {
    heading.textContent = `Links in "${selectedCatObj.name}"`;
  } else {
    heading.textContent = 'All Links Across Categories';
  }

  const filteredLinks = (studioState.links || []).filter((l) => {
    if (selectedCatId === 'all') return true;
    return String(l.category_id) === String(selectedCatId);
  });

  if (filteredLinks.length === 0) {
    listEl.innerHTML = `<div class="empty-state">No links in this category yet. Click "+ Add Link to Category" above.</div>`;
    return;
  }

  listEl.innerHTML = filteredLinks
    .map((l) => {
      const fullIdx = studioState.links.findIndex((item) => Number(item.id) === Number(l.id));
      const hasThumb = Boolean((l.image_url || '').trim());
      const thumbHtml = hasThumb
        ? `<img src="${escapeHtml(l.image_url)}" alt="" class="admin-row-thumb" />`
        : `<div class="admin-row-icon">${ICONS[l.icon] || ICONS['arrow-up-right']}</div>`;

      return `
        <div class="admin-link-row ${Number(l.active) === 0 ? 'is-inactive' : ''}">
          <div class="admin-link-left">
            ${thumbHtml}
            <div class="admin-link-info">
              <div class="admin-link-title">
                <span>${escapeHtml(l.title)}</span>
                ${l.badge ? `<span class="link-badge">${escapeHtml(l.badge)}</span>` : ''}
              </div>
              <div class="admin-link-meta">
                ${escapeHtml(l.category || 'Category')} &bull; ${l.clicks || 0} clicks &bull; ${escapeHtml(l.url)}
              </div>
            </div>
          </div>
          <div class="admin-link-actions">
            <button type="button" class="btn-ghost-sm" data-link-act="up" data-idx="${fullIdx}" title="Move up">&uarr;</button>
            <button type="button" class="btn-ghost-sm" data-link-act="down" data-idx="${fullIdx}" title="Move down">&darr;</button>
            <button type="button" class="btn-ghost-sm" data-link-act="edit" data-id="${l.id}">Edit</button>
            <button type="button" class="btn-ghost-sm" data-link-act="delete" data-id="${l.id}">Delete</button>
          </div>
        </div>
      `;
    })
    .join('');

  listEl.querySelectorAll('button[data-link-act]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const act = btn.getAttribute('data-link-act');
      const id = Number(btn.getAttribute('data-id'));
      const idx = Number(btn.getAttribute('data-idx'));
      if (act === 'edit') openLinkEditor(id);
      if (act === 'delete') handleDeleteLink(id);
      if (act === 'up') handleMoveLink(idx, -1);
      if (act === 'down') handleMoveLink(idx, 1);
    });
  });
}

function updateLinkThumbPreview(src) {
  const img = document.getElementById('link-img-preview');
  const placeholder = document.getElementById('link-img-placeholder');
  const clearBtn = document.getElementById('clear-link-img-btn');

  if (src) {
    img.src = src;
    img.classList.remove('hidden');
    placeholder.classList.add('hidden');
    clearBtn.classList.remove('hidden');
  } else {
    img.src = '';
    img.classList.add('hidden');
    placeholder.classList.remove('hidden');
    clearBtn.classList.add('hidden');
  }
}

function openLinkEditor(linkId = null) {
  const form = document.getElementById('link-form');
  const titleEl = document.getElementById('link-form-title');
  form.classList.remove('hidden');

  if (!linkId) {
    titleEl.textContent = 'Add Link to Category';
    document.getElementById('link-id').value = '';
    document.getElementById('link-title').value = '';
    document.getElementById('link-subtitle').value = '';
    document.getElementById('link-url').value = '';
    document.getElementById('link-image-url').value = '';
    updateLinkThumbPreview('');
    document.getElementById('link-badge').value = '';
    document.getElementById('link-icon').value = 'arrow-up-right';
    document.getElementById('link-active').checked = true;

    const selectEl = document.getElementById('link-category-select');
    if (selectedCatId !== 'all') {
      selectEl.value = String(selectedCatId);
    }
    return;
  }

  const item = studioState.links.find((l) => Number(l.id) === Number(linkId));
  if (!item) return;

  titleEl.textContent = 'Edit Link';
  document.getElementById('link-id').value = item.id;
  document.getElementById('link-title').value = item.title || '';
  document.getElementById('link-subtitle').value = item.subtitle || '';
  document.getElementById('link-url').value = item.url || '';
  document.getElementById('link-image-url').value = item.image_url || '';
  updateLinkThumbPreview(item.image_url || '');
  document.getElementById('link-category-select').value = String(item.category_id || 1);
  document.getElementById('link-badge').value = item.badge || '';
  document.getElementById('link-icon').value = item.icon || 'arrow-up-right';
  document.getElementById('link-active').checked = Number(item.active) !== 0;
}

async function handleDeleteLink(id) {
  if (studioState.dbConnected) {
    const res = await fetch(`/api/links?id=${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (data.ok) studioState.links = data.links;
  } else {
    studioState.links = studioState.links.filter((l) => Number(l.id) !== Number(id));
    saveLocalFallback();
  }
  renderStudio();
  showToast('Link deleted');
}

async function handleMoveLink(idx, delta) {
  const target = idx + delta;
  if (target < 0 || target >= studioState.links.length) return;
  const copy = [...studioState.links];
  const [moved] = copy.splice(idx, 1);
  copy.splice(target, 0, moved);
  studioState.links = copy;

  if (studioState.dbConnected) {
    const res = await fetch('/api/links', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ order: copy.map((l) => ({ id: l.id })) }),
    });
    const data = await res.json();
    if (data.ok) studioState.links = data.links;
  } else {
    saveLocalFallback();
  }
  renderStudio();
}

// ============================================================================
// Profile & TikTok Auto-Avatar
// ============================================================================
function updateProfileAvatarPreview(src, title) {
  const img = document.getElementById('prof-avatar-preview');
  const placeholder = document.getElementById('prof-avatar-placeholder');
  placeholder.textContent = getInitials(title);

  if (src) {
    img.src = src;
    img.classList.remove('hidden');
    placeholder.classList.add('hidden');
  } else {
    img.src = '';
    img.classList.add('hidden');
    placeholder.classList.remove('hidden');
  }
}

function populateProfileForm() {
  const p = studioState.profile;
  document.getElementById('edit-title').value = p.title || '';
  document.getElementById('edit-handle').value = p.handle || '';
  document.getElementById('edit-bio').value = p.bio || '';
  document.getElementById('edit-tiktok').value = p.tiktok_url || '';
  document.getElementById('edit-email').value = p.email || '';
  document.getElementById('edit-avatar').value = p.avatar_url || '';
  document.getElementById('edit-theme').value = p.theme_default || 'light';
  document.getElementById('sec-username').value = studioState.adminUser || 'admin';

  updateProfileAvatarPreview(p.avatar_url || '', p.title);
}

// ============================================================================
// Live Device Preview Renderer
// ============================================================================
function renderLivePreview() {
  const root = document.getElementById('live-preview-root');
  if (!root) return;

  const { profile, categories, links } = studioState;
  const visibleCats = (categories || []).filter((c) => Number(c.active) !== 0);

  const avatarHtml = profile.avatar_url
    ? `<img src="${escapeHtml(profile.avatar_url)}" class="avatar-img" alt="" />`
    : `<div class="avatar-fallback"><span>${escapeHtml(getInitials(profile.title))}</span></div>`;

  const catPillsHtml =
    `<button type="button" class="segment-btn ${
      previewCatId === 'all' ? 'active' : ''
    }" data-prev-cat="all">All</button>` +
    visibleCats
      .map((c) => {
        if ((c.url || '').trim()) {
          return `<a href="${escapeHtml(
            c.url
          )}" target="_blank" class="segment-btn active segment-link-pill">${escapeHtml(
            c.name
          )}</a>`;
        }
        const activeClass = String(previewCatId) === String(c.id) ? 'active' : '';
        return `<button type="button" class="segment-btn ${activeClass}" data-prev-cat="${
          c.id
        }">${escapeHtml(c.name)}</button>`;
      })
      .join('');

  const visibleLinks = (links || [])
    .filter((l) => Number(l.active) !== 0)
    .filter((l) => {
      if (previewCatId === 'all') return true;
      return String(l.category_id) === String(previewCatId);
    });

  const linksHtml =
    visibleLinks.length === 0
      ? `<div class="empty-state">No links in this category.</div>`
      : visibleLinks
          .map((link) => {
            const hasImage = Boolean((link.image_url || '').trim());
            const mediaHtml = hasImage
              ? `<div class="link-thumb-box"><img src="${escapeHtml(
                  link.image_url
                )}" alt="" class="link-thumb-img" /></div>`
              : `<div class="link-icon-box">${ICONS[link.icon] || ICONS['arrow-up-right']}</div>`;

            return `
              <a href="${escapeHtml(link.url)}" target="_blank" class="link-card">
                <div class="link-card-left">
                  ${mediaHtml}
                  <div class="link-text-group">
                    <div class="link-title-line">
                      <span class="link-title">${escapeHtml(link.title)}</span>
                      ${
                        link.badge
                          ? `<span class="link-badge">${escapeHtml(link.badge)}</span>`
                          : ''
                      }
                    </div>
                    ${
                      link.subtitle
                        ? `<p class="link-subtitle">${escapeHtml(link.subtitle)}</p>`
                        : ''
                    }
                  </div>
                </div>
                <div class="link-card-right">${ICONS['arrow-up-right']}</div>
              </a>
            `;
          })
          .join('');

  root.innerHTML = `
    <div class="preview-inner">
      <div class="profile-header">
        <div class="avatar-wrapper">${avatarHtml}</div>
        <div class="title-row">
          <h3 class="profile-title" style="font-size:21px;">${escapeHtml(profile.title)}</h3>
        </div>
        <p class="profile-handle">${escapeHtml(profile.handle)}</p>
        <p class="profile-bio" style="font-size:13px;margin-bottom:14px;">${escapeHtml(profile.bio)}</p>
      </div>
      <div class="category-filter-wrap" style="margin-bottom:14px;">
        <div class="category-segmented">${catPillsHtml}</div>
      </div>
      <div class="links-list">${linksHtml}</div>
    </div>
  `;

  root.querySelectorAll('button[data-prev-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      previewCatId = btn.getAttribute('data-prev-cat') || 'all';
      renderLivePreview();
    });
  });
}

// ============================================================================
// Event Listeners
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('vayz_theme') || 'light';
  applyTheme(savedTheme);

  fetchStudioData();

  // Theme Toggle
  document.getElementById('studio-theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('vayz_theme', next);
    applyTheme(next);
  });

  // Navigation Tabs
  document.querySelectorAll('.studio-nav-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.studio-nav-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const pane = tab.getAttribute('data-pane');
      document.getElementById('pane-builder').classList.toggle('hidden', pane !== 'builder');
      document.getElementById('pane-profile').classList.toggle('hidden', pane !== 'profile');
      document.getElementById('pane-security').classList.toggle('hidden', pane !== 'security');
    });
  });

  // Login Form
  document.getElementById('studio-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    errorEl.classList.add('hidden');

    if (studioState.dbConnected) {
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', username, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          errorEl.textContent = data.error || 'Invalid username or password.';
          errorEl.classList.remove('hidden');
          return;
        }
        sessionToken = data.token || '';
        localStorage.setItem('vayz_token', sessionToken);
        await fetchStudioData();
        showToast('Welcome to VayzTech Studio');
      } catch (err) {
        errorEl.textContent = err.message || 'Authentication error';
        errorEl.classList.remove('hidden');
      }
    } else {
      const savedPass = localStorage.getItem('vayz_local_pass') || 'admin123';
      const savedUser = localStorage.getItem('vayz_local_user') || 'admin';
      if (username.toLowerCase() === savedUser.toLowerCase() && password === savedPass) {
        studioState.isAdmin = true;
        localStorage.setItem('vayz_local_admin', 'true');
        renderStudio();
        showToast('Signed in');
      } else {
        errorEl.textContent = 'Invalid username or password.';
        errorEl.classList.remove('hidden');
      }
    }
  });

  // Logout
  document.getElementById('studio-logout-btn').addEventListener('click', async () => {
    if (studioState.dbConnected) {
      await fetch('/api/auth', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: 'logout' }),
      }).catch(() => {});
    }
    sessionToken = '';
    localStorage.removeItem('vayz_token');
    localStorage.removeItem('vayz_local_admin');
    studioState.isAdmin = false;
    renderStudio();
    showToast('Signed out');
  });

  // Category Form Toggle & Type Behavior
  document.getElementById('add-category-btn').addEventListener('click', () => openCategoryEditor(null));
  document.getElementById('cancel-category-btn').addEventListener('click', () => {
    document.getElementById('category-form').classList.add('hidden');
  });

  document.getElementById('cat-type').addEventListener('change', (e) => {
    const isLink = e.target.value === 'link';
    document.getElementById('cat-url-group').classList.toggle('hidden', !isLink);
    if (!isLink) {
      document.getElementById('cat-url').value = '';
    }
  });

  document.getElementById('category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('cat-id').value;
    const isLink = document.getElementById('cat-type').value === 'link';
    const payload = {
      id: id ? Number(id) : undefined,
      name: document.getElementById('cat-name').value.trim(),
      url: isLink ? document.getElementById('cat-url').value.trim() : '',
      active: document.getElementById('cat-active').checked ? 1 : 0,
    };

    if (studioState.dbConnected) {
      const res = await fetch('/api/categories', {
        method: id ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        studioState.categories = data.categories;
        if (data.links) studioState.links = data.links;
      }
    } else {
      if (id) {
        const idx = studioState.categories.findIndex((c) => Number(c.id) === Number(id));
        if (idx !== -1) studioState.categories[idx] = { ...studioState.categories[idx], ...payload };
      } else {
        const nextId =
          studioState.categories.reduce((m, c) => Math.max(m, Number(c.id) || 0), 0) + 1;
        studioState.categories.push({ ...payload, id: nextId, sort_order: nextId });
      }
      saveLocalFallback();
    }

    document.getElementById('category-form').classList.add('hidden');
    renderStudio();
    showToast(id ? 'Category updated' : 'Category created');
  });

  // Link Form & Photo Upload
  document.getElementById('add-link-btn').addEventListener('click', () => openLinkEditor(null));
  document.getElementById('cancel-link-btn').addEventListener('click', () => {
    document.getElementById('link-form').classList.add('hidden');
  });

  document.getElementById('link-image-file').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 200, 0.84);
      document.getElementById('link-image-url').value = dataUrl;
      updateLinkThumbPreview(dataUrl);
      showToast('Thumbnail photo ready');
    } catch {
      showToast('Could not process image file');
    }
  });

  document.getElementById('link-image-url').addEventListener('input', (e) => {
    updateLinkThumbPreview(e.target.value.trim());
  });

  document.getElementById('clear-link-img-btn').addEventListener('click', () => {
    document.getElementById('link-image-url').value = '';
    updateLinkThumbPreview('');
  });

  document.getElementById('link-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('link-id').value;
    const catId = Number(document.getElementById('link-category-select').value || 1);
    const catObj = studioState.categories.find((c) => Number(c.id) === catId);

    const payload = {
      id: id ? Number(id) : undefined,
      title: document.getElementById('link-title').value.trim(),
      subtitle: document.getElementById('link-subtitle').value.trim(),
      url: document.getElementById('link-url').value.trim(),
      category_id: catId,
      category: catObj ? catObj.name : 'Hardware',
      image_url: document.getElementById('link-image-url').value.trim(),
      badge: document.getElementById('link-badge').value.trim(),
      icon: document.getElementById('link-icon').value,
      active: document.getElementById('link-active').checked ? 1 : 0,
    };

    if (studioState.dbConnected) {
      const res = await fetch('/api/links', {
        method: id ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) studioState.links = data.links;
    } else {
      if (id) {
        const idx = studioState.links.findIndex((l) => Number(l.id) === Number(id));
        if (idx !== -1) studioState.links[idx] = { ...studioState.links[idx], ...payload };
      } else {
        const nextId = studioState.links.reduce((m, l) => Math.max(m, Number(l.id) || 0), 0) + 1;
        studioState.links.push({ ...payload, id: nextId, clicks: 0, sort_order: nextId });
      }
      saveLocalFallback();
    }

    document.getElementById('link-form').classList.add('hidden');
    renderStudio();
    showToast(id ? 'Link updated' : 'Link added');
  });

  // Profile Avatar Upload & TikTok Auto-Fetch
  document.getElementById('prof-avatar-file').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 256, 0.86);
      document.getElementById('edit-avatar').value = dataUrl;
      updateProfileAvatarPreview(dataUrl, document.getElementById('edit-title').value);
      showToast('Profile photo ready — click Save Profile');
    } catch {
      showToast('Failed to process image');
    }
  });

  document.getElementById('edit-avatar').addEventListener('input', (e) => {
    updateProfileAvatarPreview(e.target.value.trim(), document.getElementById('edit-title').value);
  });

  document.getElementById('clear-prof-avatar-btn').addEventListener('click', () => {
    document.getElementById('edit-avatar').value = '';
    updateProfileAvatarPreview('', document.getElementById('edit-title').value);
  });

  document.getElementById('fetch-tiktok-avatar-btn').addEventListener('click', async () => {
    const rawHandle =
      document.getElementById('edit-handle').value.trim() ||
      document.getElementById('edit-tiktok').value.trim();
    const cleanHandle = rawHandle
      .replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/i, '')
      .replace(/^@/, '')
      .split(/[/?#]/)[0]
      .trim();

    if (!cleanHandle) {
      showToast('Enter your TikTok handle first');
      return;
    }

    showToast(`Fetching TikTok avatar for @${cleanHandle}...`);
    try {
      const res = await fetch(`/api/tiktok-avatar?handle=${encodeURIComponent(cleanHandle)}`);
      const data = await res.json();
      if (data && data.ok && data.avatar_url) {
        document.getElementById('edit-avatar').value = data.avatar_url;
        updateProfileAvatarPreview(data.avatar_url, document.getElementById('edit-title').value);
        showToast('TikTok avatar loaded! Click Save Profile to publish.');
        return;
      }
    } catch (_) {
      // Fallback
    }
    const fallbackUrl = `https://unavatar.io/tiktok/${encodeURIComponent(cleanHandle)}`;
    document.getElementById('edit-avatar').value = fallbackUrl;
    updateProfileAvatarPreview(fallbackUrl, document.getElementById('edit-title').value);
    showToast('TikTok avatar URL set! Click Save Profile.');
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

    if (studioState.dbConnected) {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) studioState.profile = data.profile;
    } else {
      studioState.profile = { ...studioState.profile, ...payload };
      saveLocalFallback();
    }

    renderStudio();
    showToast('Profile saved');
  });

  // Security Form
  document.getElementById('security-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newUsername = document.getElementById('sec-username').value.trim();
    const currentPassword = document.getElementById('sec-current-password').value;
    const newPassword = document.getElementById('sec-new-password').value;

    if (studioState.dbConnected) {
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
        studioState.adminUser = data.username;
        document.getElementById('sec-current-password').value = '';
        document.getElementById('sec-new-password').value = '';
        showToast('Credentials updated in Cloudflare D1');
      } else {
        showToast(data.error || 'Failed to update credentials');
      }
    } else {
      localStorage.setItem('vayz_local_user', newUsername);
      localStorage.setItem('vayz_local_pass', newPassword);
      showToast('Credentials updated');
    }
  });
});
