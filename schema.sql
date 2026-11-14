-- Cloudflare D1 Schema for VayzTech Linktree
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  title TEXT NOT NULL DEFAULT 'VayzTech',
  handle TEXT NOT NULL DEFAULT '@vayztech',
  bio TEXT NOT NULL DEFAULT 'Curated tech, minimal setups, and future hardware reviews.',
  avatar_url TEXT NOT NULL DEFAULT '',
  tiktok_url TEXT NOT NULL DEFAULT 'https://tiktok.com/@vayztech',
  email TEXT NOT NULL DEFAULT 'contact@vayztech.com',
  theme_default TEXT NOT NULL DEFAULT 'light',
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

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

-- Seed default profile if not exists
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
);

-- Seed initial showcase links if table is empty
INSERT INTO links (title, subtitle, url, category, badge, icon, clicks, sort_order, active)
SELECT '2026 Desk Setup & Gear List', 'Complete breakdown of monitors, peripherals, and lighting', 'https://tiktok.com/@vayztech', 'Hardware', 'Updated', 'monitor', 142, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM links);

INSERT INTO links (title, subtitle, url, category, badge, icon, clicks, sort_order, active)
SELECT 'Top 5 AI & Productivity Apps', 'Tools featured in this week''s TikTok deep-dive', 'https://tiktok.com/@vayztech', 'Software', 'New', 'cpu', 98, 2, 1
WHERE (SELECT COUNT(*) FROM links) = 1;

INSERT INTO links (title, subtitle, url, category, badge, icon, clicks, sort_order, active)
SELECT 'Minimalist Wallpaper Pack (Monochrome)', 'High-resolution 6K desktop & mobile backgrounds', 'https://tiktok.com/@vayztech', 'Downloads', 'Free', 'layers', 215, 3, 1
WHERE (SELECT COUNT(*) FROM links) = 2;

INSERT INTO links (title, subtitle, url, category, badge, icon, clicks, sort_order, active)
SELECT 'Sponsorships & Tech Reviews', 'Media kit, benchmarks, and collaboration inquiries', 'mailto:hello@vayztech.com', 'Contact', '', 'mail', 34, 4, 1
WHERE (SELECT COUNT(*) FROM links) = 3;
