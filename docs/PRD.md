# TalentaDigital
TalentaDigital (TD) is a platform simple P2P service platform, people can sell their services to others and buy services from others.

### Non-Functional Requirements
- Responsive design (Mobile First)
- Simple, minimalistic but keep estethic and modern design
- Dark mode theme
- Indonesian locale
- Low barier entry
- Fast loading times
- Secure authentication
- SEO Friendly with SSR

## Tech Stack
- SvelteKit
- TailwindCSS
- TypeScript
- SQLite
- Drizzle ORM
- Vite
- Prettier
- DaisyUI
- @node-rs/argon2 (password hashing)
- OsloJS (crypto/encoding for sessions)
- better-sqlite3 (DB driver)

## Database Schema (current)
- users (`user`):
    - id: text (UUID-like)
    - full_name: text
    - age: integer | null
    - username: text (unique)
    - contact_number: text (unique)
    - password_hash: text
- sessions (`session`):
    - id: text (sha256 of token)
    - user_id: text → references user.id
    - expires_at: integer (timestamp)
- talents (`talent`):
    - id: text (primary key)
    - user_id: text → references user.id (1:1)
    - name: text
    - services: text (JSON string of string[])
    - status: text ('online' | 'offline')
    - location: text | null
    - contact_number: text | null
    - description: text | null
    - picture_url: text | null
- talent_portfolios (`talent_portfolio`):
    - id: text
    - talent_id: text → references talent.id
    - description: text
    - price: real | null
    - picture_url: text | null

## Pages (current)
- Home (`/`)
- Auth: Login/Register (`/auth/login`)
- Change Password (`/auth/password`)
- Profile (Me) (`/me`)
- Demo (Lucia prototype) (`/demo/lucia`, `/demo/lucia/login`)
- Future: Search & Filter, Public Talent Profile

## Features
### Public Section
- [x] Login
- [x] Register
- [x] Logout
- [x] Change Password
- [x] Change Profile
- [ ] Search & Filter Talent
- [ ] Talent Profile (public)
- [ ] Contact Talent (WhatsApp deep link)
- [ ] Donate to Platform (to support the platform)

### Talent Section
- [x] Edit Talent Profile (only for the talent itself)
- [ ] Add Talent Portfolio
- [ ] Edit Talent Portfolio
- [ ] Delete Talent Portfolio

## Reference Images:
- Home Page (Dark Mode)
![Home Page](./ref/home.jpeg)