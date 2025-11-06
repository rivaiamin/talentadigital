# Supabase Storage Migration Guide

This guide explains how to migrate profile picture uploads from local directory storage to Supabase Storage.

## Overview

The migration adds support for Supabase Storage while maintaining backward compatibility with local storage. The system will automatically use Supabase if configured, otherwise fall back to local storage.

## Prerequisites

1. **Supabase Project**: Create a Supabase project at [supabase.com](https://supabase.com)
2. **Storage Bucket**: Create a storage bucket named `profile-pictures` in your Supabase project
3. **Environment Variables**: Configure the required environment variables

## Setup

### 1. Install Dependencies

The Supabase client is already installed. If you need to reinstall:

```bash
pnpm add @supabase/supabase-js
```

### 2. Environment Configuration

Add these environment variables to your `.env` file:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these values in your Supabase project dashboard under Settings > API.

### 3. Create Storage Bucket

In your Supabase dashboard:

1. Go to Storage
2. Create a new bucket named `profile-pictures`
3. Set the bucket to public (for public access to images)
4. Configure RLS (Row Level Security) policies if needed

### 4. Database Migration

Apply the database schema changes:

```bash
# Generate migration
pnpm db:generate

# Apply migration
pnpm db:migrate
```

## Migration Process

### 1. Migrate Existing Images

Run the migration script to move existing local images to Supabase:

```bash
pnpm migrate-images
```

This script will:
- Find all talents with local image URLs
- Upload images to Supabase Storage
- Update database records with new Supabase URLs
- Preserve local files (for safety)

### 2. Verify Migration

Check that:
- Images are accessible via Supabase URLs
- Database records are updated correctly
- New uploads use Supabase Storage

### 3. Clean Up (Optional)

After verifying the migration, you can remove local image files:

```bash
# Backup first (recommended)
cp -r static/uploads static/uploads_backup

# Remove local uploads
rm -rf static/uploads/*
```

## Features

### Automatic Fallback

The system automatically detects if Supabase is configured:
- **Supabase configured**: Uses Supabase Storage
- **Supabase not configured**: Falls back to local storage

### Responsive Images

The system generates and stores multiple image sizes:
- **Thumbnail**: 128x128px (for avatars, lists)
- **Medium**: 400x400px (for cards, previews)
- **Full**: 800x800px (for detailed views)

### Database Schema

New fields added to the `talent` table:
- `picture_urls`: JSON field storing all responsive image URLs
- `picture_url`: Single URL field (for backward compatibility)

## Configuration

### Storage Bucket Policies

**Important**: You need to configure RLS policies for the `profile-pictures` bucket in Supabase.

#### Option 1: Using Service Role Key (Recommended for Server-Side)

If you're using `SUPABASE_SERVICE_ROLE_KEY` (recommended), the service role bypasses RLS, but you still need policies for the bucket. Run these SQL commands in your Supabase SQL Editor:

```sql
-- Allow public read access to images
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT 
USING (bucket_id = 'profile-pictures');

-- Allow service role to upload (for server-side operations)
-- Note: Service role key bypasses RLS, but this policy ensures the bucket is accessible
CREATE POLICY "Service role upload" ON storage.objects
FOR INSERT 
WITH CHECK (bucket_id = 'profile-pictures');

-- Allow service role to update/delete
CREATE POLICY "Service role update" ON storage.objects
FOR UPDATE 
USING (bucket_id = 'profile-pictures');

CREATE POLICY "Service role delete" ON storage.objects
FOR DELETE 
USING (bucket_id = 'profile-pictures');
```

#### Option 2: Using Anon Key (Requires Authentication)

If you're using `SUPABASE_ANON_KEY`, you need policies that work with authenticated users:

```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT 
USING (bucket_id = 'profile-pictures');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own images
CREATE POLICY "User update own images" ON storage.objects
FOR UPDATE 
USING (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Allow users to delete their own images
CREATE POLICY "User delete own images" ON storage.objects
FOR DELETE 
USING (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);
```

#### Quick Setup Steps:

1. Go to your Supabase Dashboard
2. Navigate to **Storage** → **Policies**
3. Select the `profile-pictures` bucket
4. Click **New Policy** and create the policies above
5. Or use the SQL Editor to run the SQL commands directly

**Note**: If you're using the service role key, make sure `SUPABASE_SERVICE_ROLE_KEY` is set in your environment variables. The service role key bypasses RLS, but the bucket still needs to be configured properly.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes (fallback) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (for server-side operations, **recommended**) | No (but recommended) |

**Important**: For server-side uploads, use `SUPABASE_SERVICE_ROLE_KEY` instead of `SUPABASE_ANON_KEY`. The service role key bypasses RLS and is safer for server-side operations. You can find it in your Supabase dashboard under Settings → API → `service_role` key (keep this secret!).

## Troubleshooting

### Common Issues

1. **"Supabase not configured" error**
   - Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
   - Verify the values are correct

2. **Upload permission denied / "new row violates row-level security policy"**
   - **If using service role key**: Make sure `SUPABASE_SERVICE_ROLE_KEY` is set (not just `SUPABASE_ANON_KEY`)
   - Check that storage bucket policies are configured (see "Storage Bucket Policies" section above)
   - Verify the bucket name is exactly `profile-pictures`
   - Ensure the bucket exists in your Supabase project
   - Check the error logs - they now show which key is being used

3. **Images not displaying**
   - Verify bucket is public
   - Check CORS settings in Supabase
   - Ensure image URLs are accessible

4. **Migration script fails**
   - Check database connection
   - Verify Supabase credentials
   - Ensure local image files exist

### Debug Mode

Enable debug logging by setting:

```bash
DEBUG=supabase:*
```

## Rollback

If you need to rollback to local storage:

1. Remove Supabase environment variables
2. The system will automatically fall back to local storage
3. Restore local image files if needed

## Performance Considerations

- **CDN**: Supabase Storage includes global CDN for fast image delivery
- **Caching**: Images are cached at the CDN level
- **Compression**: Images are automatically compressed and optimized
- **Responsive**: Multiple sizes reduce bandwidth usage

## Security

- **RLS**: Row Level Security policies control access
- **Authentication**: Only authenticated users can upload
- **Validation**: Image type and size validation
- **Compression**: Automatic image optimization

## Monitoring

Monitor your Supabase usage:
- Storage usage in Supabase dashboard
- Bandwidth usage
- Request logs
- Error rates

## Support

For issues with:
- **Supabase**: Check [Supabase documentation](https://supabase.com/docs)
- **Migration**: Review this guide and check logs
- **Application**: Check application logs and database state

