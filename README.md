# VayzTech — Monochrome Apple-Flat Link-in-Bio (Cloudflare Pages + D1)

A minimalist, flat, monochrome (pure black, white, and architectural grays) link-in-bio platform designed for a TikTok tech creator account. Built specifically for **Cloudflare Pages (Free Tier)** and **Cloudflare D1 SQLite Database (Free Tier)**.

## Features
- **Apple Flat Monochrome Design**: Strict black, white, and gray palette with zero color saturation, razor-sharp `1px` borders, and modern typography (`Inter` + `JetBrains Mono` / SF Pro stack).
- **Light & Dark Theme**: Default crisp light mode with an instant toggle to deep carbon dark mode.
- **TikTok & Email Integrations**: Dedicated monochrome SVG buttons in the hero bar and footer.
- **Built-in Admin Portal (Cloudflare D1)**:
  - Sign in directly from the top-right **Admin** button.
  - Add, edit, reorder, hide/show, or delete links.
  - Customize profile name, `@handle`, bio, avatar URL, TikTok URL, and contact email.
  - Track link click counts automatically in D1.
  - Change admin username and password (hashed with Web Crypto `SHA-256` + random salt).
- **Zero-Step Auto-Migration**: The Cloudflare Pages Functions automatically create and seed all D1 database tables (`profile`, `links`, `admins`, `sessions`) on first request.

---

## Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

*(After logging in, open the **Security** tab in the Admin Console to set your own username and password.)*

---

## How to Deploy on Cloudflare Pages + D1 (100% Free)

### 1. Create a Free D1 Database in Cloudflare Dashboard
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Go to **Workers & Pages** -> **D1 SQL Database** -> **Create Database**.
3. Name it `vayztech-db` and click **Create**.

### 2. Deploy the Project to Cloudflare Pages
1. Push this repository to GitHub (or upload via Wrangler CLI).
2. In Cloudflare Dashboard, go to **Workers & Pages** -> **Create** -> **Pages** -> **Connect to Git**.
3. Select your repository and use these build settings:
   - **Framework preset**: `None`
   - **Build command**: *(leave empty)*
   - **Build output directory**: `public`
4. Click **Save and Deploy**.

### 3. Bind the D1 Database to Your Pages Project
1. Open your deployed Cloudflare Pages project -> **Settings** -> **Functions** -> **D1 database bindings**.
2. Add a binding:
   - **Variable name**: `DB` *(must be uppercase `DB`)*
   - **D1 database**: `vayztech-db`
3. Save and trigger a redeploy (or visit your site — tables will initialize automatically on first load).
