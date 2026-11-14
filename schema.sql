-- Cloudflare D1 Schema for VayzTech Linktree + Visual Studio
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  title TEXT NOT NULL DEFAULT 'VayzTech',
  handle TEXT NOT NULL DEFAULT '@vayztech',
  bio TEXT NOT NULL DEFAULT 'Next-gen consumer tech, desk architecture & software workflows. Featured on TikTok.',
  avatar_url TEXT NOT NULL DEFAULT '',
  avatar_color INTEGER NOT NULL DEFAULT 1,
  bg_image_url TEXT NOT NULL DEFAULT '',
  bg_blur INTEGER NOT NULL DEFAULT 28,
  bg_overlay INTEGER NOT NULL DEFAULT 55,
  cat_offset_y INTEGER NOT NULL DEFAULT 0,
  carousel_interval INTEGER NOT NULL DEFAULT 5,
  tiktok_url TEXT NOT NULL DEFAULT 'https://www.tiktok.com/@vayztech',
  email TEXT NOT NULL DEFAULT 'hello@vayztech.com',
  theme_default TEXT NOT NULL DEFAULT 'light',
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS carousel_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  display_type TEXT NOT NULL DEFAULT 'filter',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL,
  category_id INTEGER NOT NULL DEFAULT 1,
  category TEXT NOT NULL DEFAULT 'Hardware',
  image_url TEXT NOT NULL DEFAULT '',
  badge TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'arrow-up-right',
  clicks INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);
