// VayzTech — Public Page Application

const DEFAULT_FALLBACK_STATE = {
  dbConnected: false,
  profile: {
    title: 'VayzTech',
    handle: '@vayztech',
    bio: 'Next-gen consumer tech, desk architecture & software workflows.\nFeatured on TikTok.',
    avatar_url: '',
    avatar_color: 1,
    bg_image_url: '',
    bg_blur: 28,
    bg_overlay: 55,
    cat_offset_y: 0,
    carousel_interval: 5,
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

let appState = structuredClone(DEFAULT_FALLBACK_STATE);
let selectedCategoryId = 'all';
let activeSlideIdx = 0;

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

function initTheme(defaultTheme = 'light') {
  const saved = localStorage.getItem('vayz_theme');
  applyTheme(saved || defaultTheme || 'light');
}

function getInitials(title) {
  const clean = (title || 'VT').trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

async function fetchAppData() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error('API unavailable');
    const data = await res.json();
    if (data && data.ok) {
      appState = {
        dbConnected: true,
        profile: data.profile || DEFAULT_FALLBACK_STATE.profile,
        carousel: Array.isArray(data.carousel) ? data.carousel : [],
        categories: Array.isArray(data.categories) ? data.categories : [],
        links: Array.isArray(data.links) ? data.links : [],
      };
      if (!localStorage.getItem('vayz_theme') && appState.profile.theme_default) {
        applyTheme(appState.profile.theme_default);
      }
      renderAll();
      return;
    }
  } catch (_) {
    const localSaved = localStorage.getItem('vayz_local_state');
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        appState = { ...DEFAULT_FALLBACK_STATE, ...parsed, dbConnected: false };
      } catch {
        appState = structuredClone(DEFAULT_FALLBACK_STATE);
      }
    }
    renderAll();
  }
}

function renderAll() {
  const { profile, carousel, categories, links } = appState;

  document.title = `${profile.title} — Links & Curated Tech`;
  document.getElementById('top-handle').textContent = profile.handle || '@vayztech';
  document.getElementById('profile-title').textContent = profile.title || 'VayzTech';
  document.getElementById('profile-handle').textContent = profile.handle || '@vayztech';
  document.getElementById('profile-bio').textContent = profile.bio || '';

  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Blurred Background Image Layer + Header Frosted Glass + Overlay Level
  const bgWrap = document.getElementById('bg-backdrop-wrap');
  const bgImg = document.getElementById('bg-backdrop-img');
  const bgOverlay = document.getElementById('bg-backdrop-overlay');
  if (bgWrap && bgImg) {
    if ((profile.bg_image_url || '').trim()) {
      document.body.classList.add('has-custom-bg');
      bgWrap.classList.remove('hidden');
      bgImg.style.backgroundImage = `url("${profile.bg_image_url.replace(/"/g, '\\"')}")`;
      const blurPx = Number(profile.bg_blur ?? 28);
      bgImg.style.filter = `blur(${blurPx}px)`;
      if (bgOverlay) {
        const overlayPct = Number(profile.bg_overlay ?? 55);
        bgOverlay.style.opacity = String(Math.max(0, Math.min(100, overlayPct)) / 100);
      }
    } else {
      document.body.classList.remove('has-custom-bg');
      bgWrap.classList.add('hidden');
      bgImg.style.backgroundImage = '';
    }
  }

  // Category Bar Vertical Offset (Move Higher / Lower)
  const navWrapEl = document.getElementById('category-nav-wrap');
  if (navWrapEl) {
    const offsetY = Number(profile.cat_offset_y ?? 0);
    navWrapEl.style.marginTop = `${offsetY}px`;
  }

  // TikTok & Mail links (Logo click also goes to TikTok)
  const tiktokHref = profile.tiktok_url || 'https://www.tiktok.com/@vayztech';
  const emailHref = profile.email
    ? profile.email.startsWith('mailto:')
      ? profile.email
      : `mailto:${profile.email}`
    : 'mailto:hello@vayztech.com';

  const avatarLink = document.getElementById('avatar-link');
  if (avatarLink) {
    avatarLink.href = tiktokHref;
  }

  document.getElementById('social-tiktok').href = tiktokHref;
  document.getElementById('footer-tiktok').href = tiktokHref;
  document.getElementById('social-email').href = emailHref;
  document.getElementById('footer-email').href = emailHref;

  // Avatar (supports full color or black & white grayscale)
  const avatarImg = document.getElementById('profile-avatar');
  const avatarFallback = document.getElementById('avatar-fallback');
  const avatarInitials = document.getElementById('avatar-initials');

  const isColor = Number(profile.avatar_color ?? 1) !== 0;
  avatarImg.classList.toggle('is-grayscale', !isColor);

  if (profile.avatar_url) {
    avatarImg.src = profile.avatar_url;
    avatarImg.classList.remove('hidden');
    avatarFallback.classList.add('hidden');
    avatarImg.onerror = () => {
      avatarImg.classList.add('hidden');
      avatarFallback.classList.remove('hidden');
      avatarInitials.textContent = getInitials(profile.title);
    };
  } else {
    avatarImg.classList.add('hidden');
    avatarFallback.classList.remove('hidden');
    avatarInitials.textContent = getInitials(profile.title);
  }

  renderCarousel(carousel);
  renderCategories(categories);
  renderPublicLinks(categories, links);
}

function renderCarousel(carouselItems) {
  const section = document.getElementById('carousel-section');
  const track = document.getElementById('carousel-track');
  const controls = document.getElementById('carousel-controls');
  const dotsEl = document.getElementById('carousel-dots');

  const visibleSlides = (carouselItems || []).filter((s) => Number(s.active) !== 0);
  if (visibleSlides.length === 0) {
    section.classList.add('hidden');
    return;
  }

  section.classList.remove('hidden');
  track.innerHTML = visibleSlides
    .map((slide) => {
      const imgHtml = (slide.image_url || '').trim()
        ? `<img src="${escapeHtml(slide.image_url)}" alt="${escapeHtml(
            slide.title
          )}" class="carousel-slide-img" loading="lazy" />`
        : `${ICONS['arrow-up-right']}`;

      return `
        <a href="${escapeHtml(slide.url)}"
           target="_blank"
           rel="noopener noreferrer"
           class="carousel-slide-card">
          <div class="carousel-slide-media">
            ${imgHtml}
          </div>
          <div class="carousel-slide-content">
            <h3 class="carousel-slide-title">${escapeHtml(slide.title)}</h3>
            ${
              slide.description
                ? `<p class="carousel-slide-desc">${escapeHtml(slide.description)}</p>`
                : ''
            }
          </div>
          <div class="link-card-right" aria-hidden="true">
            ${ICONS['arrow-up-right']}
          </div>
        </a>
      `;
    })
    .join('');

  if (visibleSlides.length > 1) {
    controls.classList.remove('hidden');
    if (activeSlideIdx >= visibleSlides.length) activeSlideIdx = 0;

    dotsEl.innerHTML = visibleSlides
      .map(
        (_, idx) =>
          `<button type="button" class="carousel-dot ${
            idx === activeSlideIdx ? 'active' : ''
          }" data-slide-idx="${idx}" aria-label="Slide ${idx + 1}"></button>`
      )
      .join('');

    const scrollToSlide = (idx) => {
      activeSlideIdx = (idx + visibleSlides.length) % visibleSlides.length;
      const cards = track.querySelectorAll('.carousel-slide-card');
      if (cards[activeSlideIdx]) {
        cards[activeSlideIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === activeSlideIdx);
      });
    };

    dotsEl.querySelectorAll('.carousel-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        scrollToSlide(Number(dot.getAttribute('data-slide-idx')));
      });
    });

    document.getElementById('carousel-prev').onclick = () => scrollToSlide(activeSlideIdx - 1);
    document.getElementById('carousel-next').onclick = () => scrollToSlide(activeSlideIdx + 1);

    // Auto-Rotate Timer
    clearInterval(window.__carouselTimer);
    const intervalSec = Number(appState.profile?.carousel_interval ?? 5);
    if (intervalSec > 0) {
      window.__carouselTimer = setInterval(() => {
        scrollToSlide(activeSlideIdx + 1);
      }, intervalSec * 1000);
    }
  } else {
    clearInterval(window.__carouselTimer);
    controls.classList.add('hidden');
  }
}

function renderCategories(categories) {
  const visibleCats = (categories || []).filter((c) => Number(c.active) !== 0);
  // Only 'filter' and 'link' categories appear in the top segmented pill bar
  // ('section' categories appear as left-aligned headings above their links)
  const barCats = visibleCats.filter((c) => c.display_type !== 'section');

  const navWrap = document.getElementById('category-nav-wrap');
  const segmented = document.getElementById('category-segmented');

  if (barCats.length === 0) {
    navWrap.classList.add('hidden');
    selectedCategoryId = 'all';
    return;
  }

  navWrap.classList.remove('hidden');

  const allPill = `<button type="button" class="segment-btn ${
    selectedCategoryId === 'all' ? 'active' : ''
  }" data-cat-id="all">All</button>`;

  const catPills = barCats
    .map((cat) => {
      const isLink = cat.display_type === 'link' || Boolean((cat.url || '').trim());
      if (isLink && (cat.url || '').trim()) {
        return `<a href="${escapeHtml(
          cat.url
        )}" target="_blank" rel="noopener noreferrer" class="segment-btn active segment-link-pill">${escapeHtml(
          cat.name
        )}</a>`;
      }
      const isActive = String(selectedCategoryId) === String(cat.id) ? 'active' : '';
      return `<button type="button" class="segment-btn ${isActive}" data-cat-id="${cat.id}">${escapeHtml(
        cat.name
      )}</button>`;
    })
    .join('');

  segmented.innerHTML = allPill + catPills;

  segmented.querySelectorAll('button[data-cat-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedCategoryId = btn.getAttribute('data-cat-id') || 'all';
      renderCategories(appState.categories);
      renderPublicLinks(appState.categories, appState.links);
    });
  });
}

function buildLinkCardHtml(link) {
  const iconSvg = ICONS[link.icon] || ICONS['arrow-up-right'];
  const hasImage = Boolean((link.image_url || '').trim());

  const mediaHtml = hasImage
    ? `<div class="link-thumb-box"><img src="${escapeHtml(
        link.image_url
      )}" alt="${escapeHtml(link.title)}" class="link-thumb-img" loading="lazy" /></div>`
    : `<div class="link-icon-box" aria-hidden="true">${iconSvg}</div>`;

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
        ${mediaHtml}
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
}

function renderPublicLinks(categories, links) {
  const topSectionsWrap = document.getElementById('top-sections-wrap');
  const topSectionsList = document.getElementById('top-sections-list');
  const container = document.getElementById('links-list');
  const visibleCats = (categories || []).filter((c) => Number(c.active) !== 0);
  const visibleLinks = (links || []).filter((l) => Number(l.active) !== 0);

  if (visibleLinks.length === 0) {
    if (topSectionsWrap) topSectionsWrap.classList.add('hidden');
    container.innerHTML = `<div class="empty-state">No links available yet.</div>`;
    return;
  }

  // Find index of the first filter/link pill category to know which 'section' categories were placed ABOVE the pill bar
  const firstBarCatIdx = visibleCats.findIndex((c) => c.display_type !== 'section');

  const topSectionCats = [];
  const bottomSectionCats = [];

  visibleCats.forEach((c, idx) => {
    if (c.display_type === 'section') {
      if (firstBarCatIdx === -1 || idx < firstBarCatIdx) {
        topSectionCats.push(c);
      } else {
        bottomSectionCats.push(c);
      }
    }
  });

  // Render Top Section Categories ABOVE the category pills bar
  if (topSectionsWrap && topSectionsList) {
    const topHtmlParts = [];
    topSectionCats.forEach((secCat) => {
      const secLinks = visibleLinks.filter(
        (l) =>
          String(l.category_id) === String(secCat.id) ||
          (l.category || '').toLowerCase() === secCat.name.toLowerCase()
      );
      if (secLinks.length > 0) {
        topHtmlParts.push(`
          <div class="category-section-group">
            <h2 class="category-section-heading">${escapeHtml(secCat.name)}</h2>
            ${secLinks.map(buildLinkCardHtml).join('')}
          </div>
        `);
      }
    });

    if (topHtmlParts.length > 0) {
      topSectionsWrap.classList.remove('hidden');
      topSectionsList.innerHTML = topHtmlParts.join('');
    } else {
      topSectionsWrap.classList.add('hidden');
      topSectionsList.innerHTML = '';
    }
  }

  // If a specific filter category pill is selected, show links for that category below the bar
  if (selectedCategoryId !== 'all') {
    const selectedCatObj = visibleCats.find((c) => String(c.id) === String(selectedCategoryId));
    const filtered = visibleLinks.filter(
      (l) =>
        String(l.category_id) === String(selectedCategoryId) ||
        (selectedCatObj && (l.category || '').toLowerCase() === selectedCatObj.name.toLowerCase())
    );

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state">No links in this category yet.</div>`;
    } else {
      container.innerHTML = filtered.map(buildLinkCardHtml).join('');
    }
  } else {
    // When "All" is selected:
    const sectionCatIds = new Set(
      visibleCats.filter((c) => c.display_type === 'section').map((c) => String(c.id))
    );

    const standardLinks = visibleLinks.filter((l) => !sectionCatIds.has(String(l.category_id)));
    const htmlParts = [];

    if (standardLinks.length > 0) {
      htmlParts.push(standardLinks.map(buildLinkCardHtml).join(''));
    }

    // Render remaining 'section' categories that are ordered AFTER the first filter pill
    bottomSectionCats.forEach((secCat) => {
      const secLinks = visibleLinks.filter(
        (l) =>
          String(l.category_id) === String(secCat.id) ||
          (l.category || '').toLowerCase() === secCat.name.toLowerCase()
      );
      if (secLinks.length > 0) {
        htmlParts.push(`
          <div class="category-section-group">
            <h2 class="category-section-heading">${escapeHtml(secCat.name)}</h2>
            ${secLinks.map(buildLinkCardHtml).join('')}
          </div>
        `);
      }
    });

    container.innerHTML = htmlParts.join('');
  }

  // Attach click tracking to all rendered cards (both top and bottom sections)
  document.querySelectorAll('.link-card').forEach((card) => {
    card.onclick = () => {
      const id = Number(card.getAttribute('data-link-id'));
      if (!id) return;
      if (appState.dbConnected) {
        fetch('/api/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
          keepalive: true,
        }).catch(() => {});
      }
    };
  });
}

function checkAdminRedirect() {
  if (window.location.hash === '#admin' || window.location.hash === '#login') {
    window.location.href = '/admin.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkAdminRedirect();
  window.addEventListener('hashchange', checkAdminRedirect);

  window.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      window.location.href = '/admin.html';
    }
  });

  initTheme('light');
  fetchAppData();

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('vayz_theme', next);
    applyTheme(next);
  });

  document.getElementById('share-btn').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Page link copied to clipboard');
    } catch {
      showToast(window.location.href);
    }
  });
});
