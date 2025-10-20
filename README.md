# TalentaDigital

## Development

1. Install dependencies

```bash
pnpm install
```

2. Configure environment

Create a `.env` file with:

```bash
DATABASE_URL=./.data/dev.sqlite
```

3. Database (Drizzle)

- Push schema to DB (creates tables if missing):

```bash
pnpm db:push
```

- Generate migrations from schema changes:

```bash
pnpm db:generate
```

- Apply migrations:

```bash
pnpm db:migrate
```

- Open Drizzle Studio:

```bash
pnpm db:studio
```

4. Run dev server

```bash
pnpm dev
```

## Notes

- Locale defaults: `id-ID` (language), `Asia/Jakarta` (timezone), currency `IDR`.
- Registration uses full name and auto-generates a unique username.
