# SQLite to PostgreSQL Migration Guide

This guide will help you migrate your TalentADigital application from SQLite to PostgreSQL.

## ✅ What's Been Fixed

1. **Schema Updated**: Converted from SQLite to PostgreSQL format
2. **Dependencies**: Added `better-sqlite3` for data migration
3. **Migration Script**: Created automated data migration script
4. **Fresh Migrations**: Generated new PostgreSQL migrations

## 🚀 Step-by-Step Migration Process

### 1. Set Up PostgreSQL Database

Choose one of these options:

#### Option A: Docker (Recommended for development)
```bash
# Start PostgreSQL with Docker
docker run --name talentadigital-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=talentadigital \
  -p 5432:5432 \
  -d postgres:15
```

#### Option B: Local PostgreSQL Installation
Install PostgreSQL on your system and create a database:
```sql
CREATE DATABASE talentadigital;
```

### 2. Set Up Environment Variables

Create a `.env` file in your project root:

```bash
# For Docker PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/talentadigital"

# For local PostgreSQL (replace with your credentials)
# DATABASE_URL="postgresql://username:password@localhost:5432/talentadigital"
```

### 3. Run PostgreSQL Migrations

```bash
# Generate fresh migrations (already done)
pnpm db:generate

# Apply migrations to PostgreSQL
pnpm db:migrate
```

### 4. Migrate Your Data

```bash
# Run the data migration script
npx tsx scripts/migrate-sqlite-to-postgres.ts
```

### 5. Verify Migration

```bash
# Open Drizzle Studio to verify data
pnpm db:studio
```

## 🔧 Troubleshooting

### If `pnpm db:generate` fails:
- Make sure `DATABASE_URL` is set correctly
- Check that PostgreSQL is running
- Verify database connection

### If `pnpm db:migrate` fails:
- Ensure PostgreSQL database exists
- Check user permissions
- Verify connection string format

### If data migration fails:
- Check that SQLite database (`local.db`) exists
- Verify PostgreSQL migrations have been applied
- Check console output for specific error messages

## 📊 What Gets Migrated

The migration script transfers:
- ✅ Users (with all fields)
- ✅ Sessions (with proper timestamp conversion)
- ✅ Talents (with JSON services parsing)
- ✅ Talent Portfolios (with decimal price conversion)

## 🗂️ File Changes Made

1. **`src/lib/server/db/schema.ts`**: Converted to PostgreSQL format
2. **`scripts/migrate-sqlite-to-postgres.ts`**: New migration script
3. **`drizzle/`**: Fresh PostgreSQL migrations
4. **`package.json`**: Added `better-sqlite3` dependency

## 🎯 Next Steps After Migration

1. **Test your application** thoroughly
2. **Backup your SQLite database** (keep as backup)
3. **Update your deployment** to use PostgreSQL
4. **Remove SQLite dependencies** if no longer needed

## 🆘 Need Help?

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your PostgreSQL connection
3. Ensure all environment variables are set correctly
4. Make sure your PostgreSQL database is running

The migration script includes detailed logging to help diagnose any issues.
