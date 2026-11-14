// VayzTech Visual Studio — Full-Page Graphical Creator (/admin.html)

const DEFAULT_FALLBACK_STATE = {
  dbConnected: false,
  isAdmin: false,
  adminUser: 'admin',
  profile: {
    title: 'VayzTech',
    handle: '@vayztech',
    bio: 'Next-gen consumer tech, desk architecture & software workflows.\nFeatured on TikTok.',
    avatar_url: '',
    avatar_color: 1,
    bg_image_url: '',
    bg_blur: 28,
    tiktok_url: 'https://www.tiktok.com/@vayztech',
    email: 'hello@vayztech.com',
    theme_default: 'light',
  },
  carousel: [],
  categories: [
    { id: 1, name: 'Hardware', slug: 'hardware', url: '', display_type: 'filter', sort_order: 1, active: 1 },
    { id: 2, name: 'Software', slug: 'software', url: '', display_type: 'filter', sort_order: 2, active: 1 },
    { id: 3, name: 'Wallpapers', slug: 'wallpapers', url: '', display_type: 'section', sort_order: 3, active: 1 },
    {
      id: 4,
      name: 'TikTok Feed ↗',
      slug: 'tiktok-feed',
      url: 'https://www.tiktok.com/@vayztech',
      display_type: 'link',
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

// Client-side Image Compressor
function compressImageFile(file, maxSize = 256, quality = 0.84, square = true) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (square) {
          const minSide = Math.min(img.width, img.height);
          const sx = (img.width - minSide) / 2;
          const sy = (img.height - minSide) / 2;
          canvas.width = maxSize;
          canvas.height = maxSize;
          ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, maxSize, maxSize);
        } else {
          // Maintain aspect ratio for blurred background images
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

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
      carousel: studioState.carousel,
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
        carousel: Array.isArray(data.carousel) ? data.carousel : [],
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
  renderCarouselBuilder();
  populateProfileForm();
  renderLivePreview();
}

// ============================================================================
// Step 1: Categories & Left-Aligned Headings Builder
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
      const dtype = cat.display_type || ((cat.url || '').trim() ? 'link' : 'filter');
      const count = (studioState.links || []).filter(
        (l) => String(l.category_id) === String(cat.id)
      ).length;

      let typeBadge = `${count} links • Filter Pill`;
      if (dtype === 'section') {
        typeBadge = `${count} links • Left Title Heading`;
      } else if (dtype === 'link') {
        typeBadge = 'Direct Link Pill ↗';
      }

      return `
        <div class="cat-chip ${isSelected}" data-select-cat="${cat.id}">
          <div class="cat-chip-main">
            <span class="cat-chip-name">${escapeHtml(cat.name)}</span>
            <span class="cat-chip-meta">${typeBadge}</span>
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

  listEl.querySelectorAll('[data-select-cat]').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      selectedCatId = chip.getAttribute('data-select-cat') || 'all';
      previewCatId = 'all';
      renderCategoriesBuilder();
      renderLinksBuilder();
      renderLivePreview();
    });
  });

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

  // Populate category select inside link form
  const selectEl = document.getElementById('link-category-select');
  const linkHosterCats = cats.filter((c) => c.display_type !== 'link');
  const availableCats = linkHosterCats.length > 0 ? linkHosterCats : cats;
  selectEl.innerHTML = availableCats
    .map(
      (c) =>
        `<option value="${c.id}">${escapeHtml(c.name)} (${
          c.display_type === 'section' ? 'Left Heading' : 'Filter Pill'
        })</option>`
    )
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
  const dtype = cat.display_type || ((cat.url || '').trim() ? 'link' : 'filter');
  typeSelect.value = dtype;
  document.getElementById('cat-url').value = cat.url || '';
  urlGroup.classList.toggle('hidden', dtype !== 'link');
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
// Step 2: Links Builder
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
// Step 3: Featured Carousel Builder (Between Bio & Categories)
// ============================================================================
function renderCarouselBuilder() {
  const listEl = document.getElementById('studio-carousel-list');
  const slides = studioState.carousel || [];

  if (slides.length === 0) {
    listEl.innerHTML = `<div class="empty-state">No carousel slides yet. Click "+ Add Carousel Slide" to highlight featured content between your bio and categories.</div>`;
    return;
  }

  listEl.innerHTML = slides
    .map((s, idx) => {
      const hasThumb = Boolean((s.image_url || '').trim());
      const thumbHtml = hasThumb
        ? `<img src="${escapeHtml(s.image_url)}" alt="" class="admin-row-thumb" />`
        : `<div class="admin-row-icon">${ICONS['arrow-up-right']}</div>`;

      return `
        <div class="admin-link-row ${Number(s.active) === 0 ? 'is-inactive' : ''}">
          <div class="admin-link-left">
            ${thumbHtml}
            <div class="admin-link-info">
              <div class="admin-link-title">
                <span>${escapeHtml(s.title)}</span>
              </div>
              <div class="admin-link-meta">
                ${escapeHtml(s.description || 'No description')} &bull; ${escapeHtml(s.url)}
              </div>
            </div>
          </div>
          <div class="admin-link-actions">
            <button type="button" class="btn-ghost-sm" data-slide-act="up" data-idx="${idx}">&uarr;</button>
            <button type="button" class="btn-ghost-sm" data-slide-act="down" data-idx="${idx}">&darr;</button>
            <button type="button" class="btn-ghost-sm" data-slide-act="edit" data-id="${s.id}">Edit</button>
            <button type="button" class="btn-ghost-sm" data-slide-act="delete" data-id="${s.id}">Delete</button>
          </div>
        </div>
      `;
    })
    .join('');

  listEl.querySelectorAll('button[data-slide-act]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const act = btn.getAttribute('data-slide-act');
      const id = Number(btn.getAttribute('data-id'));
      const idx = Number(btn.getAttribute('data-idx'));
      if (act === 'edit') openSlideEditor(id);
      if (act === 'delete') handleDeleteSlide(id);
      if (act === 'up') handleMoveSlide(idx, -1);
      if (act === 'down') handleMoveSlide(idx, 1);
    });
  });
}

function updateSlidePreview(src) {
  const img = document.getElementById('slide-img-preview');
  const placeholder = document.getElementById('slide-img-placeholder');
  const clearBtn = document.getElementById('clear-slide-img-btn');
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

function openSlideEditor(slideId = null) {
  const form = document.getElementById('carousel-form');
  const titleEl = document.getElementById('carousel-form-title');
  form.classList.remove('hidden');

  if (!slideId) {
    titleEl.textContent = 'New Carousel Slide';
    document.getElementById('slide-id').value = '';
    document.getElementById('slide-title').value = '';
    document.getElementById('slide-desc').value = '';
    document.getElementById('slide-url').value = '';
    document.getElementById('slide-image-url').value = '';
    updateSlidePreview('');
    document.getElementById('slide-active').checked = true;
    return;
  }

  const s = (studioState.carousel || []).find((item) => Number(item.id) === Number(slideId));
  if (!s) return;

  titleEl.textContent = 'Edit Carousel Slide';
  document.getElementById('slide-id').value = s.id;
  document.getElementById('slide-title').value = s.title || '';
  document.getElementById('slide-desc').value = s.description || '';
  document.getElementById('slide-url').value = s.url || '';
  document.getElementById('slide-image-url').value = s.image_url || '';
  updateSlidePreview(s.image_url || '');
  document.getElementById('slide-active').checked = Number(s.active) !== 0;
}

async function handleDeleteSlide(id) {
  if (studioState.dbConnected) {
    const res = await fetch(`/api/carousel?id=${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (data.ok) studioState.carousel = data.carousel;
  } else {
    studioState.carousel = (studioState.carousel || []).filter((s) => Number(s.id) !== Number(id));
    saveLocalFallback();
  }
  renderStudio();
  showToast('Carousel slide deleted');
}

async function handleMoveSlide(idx, delta) {
  const target = idx + delta;
  if (target < 0 || target >= studioState.carousel.length) return;
  const copy = [...studioState.carousel];
  const [moved] = copy.splice(idx, 1);
  copy.splice(target, 0, moved);
  studioState.carousel = copy;

  if (studioState.dbConnected) {
    const res = await fetch('/api/carousel', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ order: copy.map((s) => ({ id: s.id })) }),
    });
    const data = await res.json();
    if (data.ok) studioState.carousel = data.carousel;
  } else {
    saveLocalFallback();
  }
  renderStudio();
}

// ============================================================================
// Step 4: Profile, Color Logo & Blurred Background
// ============================================================================
function updateProfileAvatarPreview(src, title, isColor = true) {
  const img = document.getElementById('prof-avatar-preview');
  const placeholder = document.getElementById('prof-avatar-placeholder');
  placeholder.textContent = getInitials(title);
  img.classList.toggle('is-grayscale', !isColor);

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

function updateBgImagePreview(src) {
  const img = document.getElementById('bg-img-preview');
  const placeholder = document.getElementById('bg-img-placeholder');
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
  const isColor = Number(p.avatar_color ?? 1) !== 0;
  document.getElementById('edit-avatar-color').checked = isColor;
  document.getElementById('edit-bg-image').value = p.bg_image_url || '';
  const blurVal = Number(p.bg_blur ?? 28);
  document.getElementById('edit-bg-blur').value = blurVal;
  document.getElementById('bg-blur-val').textContent = blurVal;
  document.getElementById('edit-theme').value = p.theme_default || 'light';
  document.getElementById('sec-username').value = studioState.adminUser || 'admin';

  updateProfileAvatarPreview(p.avatar_url || '', p.title, isColor);
  updateBgImagePreview(p.bg_image_url || '');
}

// ============================================================================
// Live Device Preview Renderer
// ============================================================================
function renderLivePreview() {
  const root = document.getElementById('live-preview-root');
  if (!root) return;

  const { profile, carousel, categories, links } = studioState;
  const visibleCats = (categories || []).filter((c) => Number(c.active) !== 0);
  const visibleSlides = (carousel || []).filter((s) => Number(s.active) !== 0);
  const visibleLinks = (links || []).filter((l) => Number(l.active) !== 0);

  const isColor = Number(profile.avatar_color ?? 1) !== 0;
  const tiktokHref = profile.tiktok_url || 'https://www.tiktok.com/@vayztech';

  const avatarHtml = profile.avatar_url
    ? `<img src="${escapeHtml(profile.avatar_url)}" class="avatar-img ${
        isColor ? '' : 'is-grayscale'
      }" alt="" />`
    : `<div class="avatar-fallback"><span>${escapeHtml(getInitials(profile.title))}</span></div>`;

  // Blurred Background inside device screen
  const hasBg = Boolean((profile.bg_image_url || '').trim());
  const blurPx = Number(profile.bg_blur ?? 28);
  const bgLayerHtml = hasBg
    ? `<div style="position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none;">
         <div style="position:absolute;inset:-24px;background-image:url('${escapeHtml(
           profile.bg_image_url
         )}');background-size:cover;background-position:center;filter:blur(${blurPx}px);opacity:0.42;"></div>
       </div>`
    : '';

  // Carousel HTML
  const carouselHtml =
    visibleSlides.length > 0
      ? `<div class="carousel-section" style="margin-bottom:18px;">
           <div class="carousel-viewport">
             <div class="carousel-track">
               ${visibleSlides
                 .map(
                   (s) => `
                 <a href="${escapeHtml(s.url)}" target="_blank" class="carousel-slide-card" style="padding:12px;gap:12px;">
                   <div class="carousel-slide-media" style="width:68px;height:68px;">
                     ${
                       s.image_url
                         ? `<img src="${escapeHtml(s.image_url)}" class="carousel-slide-img" alt="" />`
                         : ICONS['arrow-up-right']
                     }
                   </div>
                   <div class="carousel-slide-content">
                     <h4 class="carousel-slide-title" style="font-size:14px;">${escapeHtml(s.title)}</h4>
                     ${
                       s.description
                         ? `<p class="carousel-slide-desc" style="font-size:12px;">${escapeHtml(
                             s.description
                           )}</p>`
                         : ''
                     }
                   </div>
                 </a>
               `
                 )
                 .join('')}
             </div>
           </div>
         </div>`
      : '';

  // Filter & Link Category Pills
  const barCats = visibleCats.filter((c) => c.display_type !== 'section');
  const catPillsHtml =
    barCats.length > 0
      ? `<div class="category-filter-wrap" style="margin-bottom:14px;">
           <div class="category-segmented">
             <button type="button" class="segment-btn ${
               previewCatId === 'all' ? 'active' : ''
             }" data-prev-cat="all">All</button>
             ${barCats
               .map((c) => {
                 if (c.display_type === 'link' || (c.url || '').trim()) {
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
               .join('')}
           </div>
         </div>`
      : '';

  const renderCard = (link) => {
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
              ${link.badge ? `<span class="link-badge">${escapeHtml(link.badge)}</span>` : ''}
            </div>
            ${link.subtitle ? `<p class="link-subtitle">${escapeHtml(link.subtitle)}</p>` : ''}
          </div>
        </div>
        <div class="link-card-right">${ICONS['arrow-up-right']}</div>
      </a>
    `;
  };

  let linksContentHtml = '';
  if (previewCatId !== 'all') {
    const filtered = visibleLinks.filter((l) => String(l.category_id) === String(previewCatId));
    linksContentHtml =
      filtered.length > 0
        ? filtered.map(renderCard).join('')
        : `<div class="empty-state">No links in this category.</div>`;
  } else {
    const sectionCatIds = new Set(
      visibleCats.filter((c) => c.display_type === 'section').map((c) => String(c.id))
    );
    const standardLinks = visibleLinks.filter((l) => !sectionCatIds.has(String(l.category_id)));
    const parts = [];
    if (standardLinks.length > 0) {
      parts.push(standardLinks.map(renderCard).join(''));
    }
    visibleCats
      .filter((c) => c.display_type === 'section')
      .forEach((sec) => {
        const secLinks = visibleLinks.filter((l) => String(l.category_id) === String(sec.id));
        if (secLinks.length > 0) {
          parts.push(`
            <div class="category-section-group">
              <h2 class="category-section-heading">${escapeHtml(sec.name)}</h2>
              ${secLinks.map(renderCard).join('')}
            </div>
          `);
        }
      });
    linksContentHtml = parts.join('') || `<div class="empty-state">No links yet.</div>`;
  }

  root.innerHTML = `
    ${bgLayerHtml}
    <div class="preview-inner" style="position:relative;z-index:2;">
      <div class="profile-header" style="margin-bottom:20px;">
        <a href="${escapeHtml(tiktokHref)}" target="_blank" class="avatar-wrapper" title="Opens TikTok">${avatarHtml}</a>
        <div class="title-row">
          <h3 class="profile-title" style="font-size:21px;">${escapeHtml(profile.title)}</h3>
        </div>
        <p class="profile-handle">${escapeHtml(profile.handle)}</p>
        <p class="profile-bio" style="font-size:13px;margin-bottom:14px;">${escapeHtml(profile.bio)}</p>
      </div>
      ${carouselHtml}
      ${catPillsHtml}
      <div class="links-list">${linksContentHtml}</div>
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
      document.getElementById('pane-carousel').classList.toggle('hidden', pane !== 'carousel');
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

  // Category Form
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
    const display_type = document.getElementById('cat-type').value;
    const payload = {
      id: id ? Number(id) : undefined,
      name: document.getElementById('cat-name').value.trim(),
      display_type,
      url: display_type === 'link' ? document.getElementById('cat-url').value.trim() : '',
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
      const dataUrl = await compressImageFile(file, 200, 0.84, true);
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

  // Carousel Form & Slide Photo Upload
  document.getElementById('add-slide-btn').addEventListener('click', () => openSlideEditor(null));
  document.getElementById('cancel-slide-btn').addEventListener('click', () => {
    document.getElementById('carousel-form').classList.add('hidden');
  });

  document.getElementById('slide-image-file').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 260, 0.85, true);
      document.getElementById('slide-image-url').value = dataUrl;
      updateSlidePreview(dataUrl);
      showToast('Slide photo ready');
    } catch {
      showToast('Could not process slide photo');
    }
  });

  document.getElementById('slide-image-url').addEventListener('input', (e) => {
    updateSlidePreview(e.target.value.trim());
  });

  document.getElementById('clear-slide-img-btn').addEventListener('click', () => {
    document.getElementById('slide-image-url').value = '';
    updateSlidePreview('');
  });

  document.getElementById('carousel-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('slide-id').value;
    const payload = {
      id: id ? Number(id) : undefined,
      title: document.getElementById('slide-title').value.trim(),
      description: document.getElementById('slide-desc').value.trim(),
      url: document.getElementById('slide-url').value.trim(),
      image_url: document.getElementById('slide-image-url').value.trim(),
      active: document.getElementById('slide-active').checked ? 1 : 0,
    };

    if (studioState.dbConnected) {
      const res = await fetch('/api/carousel', {
        method: id ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) studioState.carousel = data.carousel;
    } else {
      if (!studioState.carousel) studioState.carousel = [];
      if (id) {
        const idx = studioState.carousel.findIndex((s) => Number(s.id) === Number(id));
        if (idx !== -1) studioState.carousel[idx] = { ...studioState.carousel[idx], ...payload };
      } else {
        const nextId =
          studioState.carousel.reduce((m, s) => Math.max(m, Number(s.id) || 0), 0) + 1;
        studioState.carousel.push({ ...payload, id: nextId, sort_order: nextId });
      }
      saveLocalFallback();
    }

    document.getElementById('carousel-form').classList.add('hidden');
    renderStudio();
    showToast(id ? 'Slide updated' : 'Slide added to carousel');
  });

  // Profile Avatar Upload, Color Toggle & Blurred Background Upload
  document.getElementById('prof-avatar-file').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 256, 0.86, true);
      document.getElementById('edit-avatar').value = dataUrl;
      updateProfileAvatarPreview(
        dataUrl,
        document.getElementById('edit-title').value,
        document.getElementById('edit-avatar-color').checked
      );
      showToast('Logo ready — click Save Profile');
    } catch {
      showToast('Failed to process image');
    }
  });

  document.getElementById('edit-avatar').addEventListener('input', (e) => {
    updateProfileAvatarPreview(
      e.target.value.trim(),
      document.getElementById('edit-title').value,
      document.getElementById('edit-avatar-color').checked
    );
  });

  document.getElementById('edit-avatar-color').addEventListener('change', (e) => {
    updateProfileAvatarPreview(
      document.getElementById('edit-avatar').value.trim(),
      document.getElementById('edit-title').value,
      e.target.checked
    );
  });

  document.getElementById('clear-prof-avatar-btn').addEventListener('click', () => {
    document.getElementById('edit-avatar').value = '';
    updateProfileAvatarPreview('', document.getElementById('edit-title').value, true);
  });

  // Blurred Background Upload & Blur Slider
  document.getElementById('bg-image-file').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 480, 0.78, false);
      document.getElementById('edit-bg-image').value = dataUrl;
      updateBgImagePreview(dataUrl);
      showToast('Blurred background image ready — click Save Profile');
    } catch {
      showToast('Failed to process background image');
    }
  });

  document.getElementById('edit-bg-image').addEventListener('input', (e) => {
    updateBgImagePreview(e.target.value.trim());
  });

  document.getElementById('clear-bg-img-btn').addEventListener('click', () => {
    document.getElementById('edit-bg-image').value = '';
    updateBgImagePreview('');
  });

  document.getElementById('edit-bg-blur').addEventListener('input', (e) => {
    document.getElementById('bg-blur-val').textContent = e.target.value;
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
        updateProfileAvatarPreview(
          data.avatar_url,
          document.getElementById('edit-title').value,
          document.getElementById('edit-avatar-color').checked
        );
        showToast('TikTok avatar loaded! Click Save Profile to publish.');
        return;
      }
    } catch (_) {
      // Fallback
    }
    const fallbackUrl = `https://unavatar.io/tiktok/${encodeURIComponent(cleanHandle)}`;
    document.getElementById('edit-avatar').value = fallbackUrl;
    updateProfileAvatarPreview(
      fallbackUrl,
      document.getElementById('edit-title').value,
      document.getElementById('edit-avatar-color').checked
    );
    showToast('TikTok avatar URL set! Click Save Profile.');
  });

  // Save Profile Form
  document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      title: document.getElementById('edit-title').value.trim(),
      handle: document.getElementById('edit-handle').value.trim(),
      bio: document.getElementById('edit-bio').value,
      tiktok_url: document.getElementById('edit-tiktok').value.trim(),
      email: document.getElementById('edit-email').value.trim(),
      avatar_url: document.getElementById('edit-avatar').value.trim(),
      avatar_color: document.getElementById('edit-avatar-color').checked ? 1 : 0,
      bg_image_url: document.getElementById('edit-bg-image').value.trim(),
      bg_blur: Number(document.getElementById('edit-bg-blur').value || 28),
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
    showToast('Profile & Background saved');
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
