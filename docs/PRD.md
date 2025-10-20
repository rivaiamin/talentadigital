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
- Lucia
- Drizzle
- Vite
- Prettier

## Database Schema
- talents:
    - id: uuid
    - name: string
    - services: string[]
    - status: enum('active', 'inactive') 
    - location: string | null
    - contact_number: string | null
    - description: text | null
- talent_portfolios:
    - id: uuid
    - talent_id: reference to talent.id
    - description: text
    - price: decimal | null
    - picture_url: string | null

## Pages
- Home
- Register Talent
- Login Talent
- Search & Filter Talent
- Talent Profile
- Edit Talent Profile (only for the talent itself)

## Features
### Public Section
- [ ] Login
- [ ] Register
- [ ] Logout
- [ ] Change Password
- [ ] Change Profile
- [ ] Search & Filter Talent
- [ ] Talent Profile
- [ ] Contact Talent (redirect to whatsapp with the talent's contact number)
- [ ] Donate to Platform (to support the platform)

### Talent Section
- [ ] Edit Talent Profile (only for the talent itself)
- [ ] Add Talent Portfolio
- [ ] Edit Talent Portfolio
- [ ] Delete Talent Portfolio

## Reference Images:
- Home Page (Dark Mode)
![Home Page](./ref/home.jpeg)