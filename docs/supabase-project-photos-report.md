# Supabase Project Photos Report

## Summary
Project photo uploads and rendering support a Supabase-backed filesystem disk. The public website consumes project photo URLs directly (including Supabase public object URLs) and includes retry/fallback logic in the project card carousel.

## Current Integration Points

### Upload Path
- Admin uploads use `POST /api/admin/upload` with `folder=projects`.
- Backend stores to the configured disk: `env('FILESYSTEM_DISK', 'public')`.
- Controller: [ProjectController.php](file:///c:/laragon/www/portfolio/app/Http/Controllers/ProjectController.php)

### Supabase Filesystem Disk
Configured in [filesystems.php](file:///c:/laragon/www/portfolio/config/filesystems.php) under `disks.supabase` as an S3-compatible driver:
- `SUPABASE_ENDPOINT` should be `https://<project-ref>.supabase.co/storage/v1/s3`
- `SUPABASE_BUCKET` should be the bucket name (e.g. `PROJECTS`)
- `SUPABASE_URL` should be the public base URL used by `Storage::url()`

## Bucket + CORS Validation

### Public Object URL Check
Validated the following public object URL responds successfully:
- `https://oigzmkdbhqyxtruudizq.supabase.co/storage/v1/object/public/PROJECTS/projects/HsoRLhCM6qpaXOieMYWU4tto8KFO5oolyVxUZmWy.jpg`

Result:
- HTTP status: `200`
- `Access-Control-Allow-Origin`: `*`

This indicates the bucket/object is publicly readable and CORS allows the browser to load it cross-origin.

## UI Resilience Improvements

### Project Card Carousel Retry + Fallback
- Component: [ProjectPhotoCarousel.vue](file:///c:/laragon/www/portfolio/resources/js/components/ProjectPhotoCarousel.vue)
- Behavior:
  - On image load failure, retries up to 2 times with cache-busting query parameters.
  - Falls back to `/logo.svg` after retries to avoid permanent skeleton/blank cards.

## Notes
- Browser devtools will still show image requests; the resilience improvements focus on user experience (avoid blank UI) rather than hiding network traffic.

