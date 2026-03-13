# Project Photo Management System

## Overview
This project supports multi-photo galleries per project (5–20 photos). Photos are uploaded via the admin dashboard, stored on the configured filesystem disk (local/public or Supabase), and rendered on the home page as:

- A per-project auto-playing carousel on each project card
- A project details modal that shows a responsive photo grid
- A full-screen lightbox with navigation and zoom

## Data Model

### Database
- `projects.images` (JSON, nullable): array of photo URLs/paths
- `projects.image` (string, nullable): cover image URL/path (the system uses `images[0]` as the cover when available)

Migration: [2026_03_13_000001_add_images_to_projects_table.php](file:///c:/laragon/www/portfolio/database/migrations/2026_03_13_000001_add_images_to_projects_table.php)

### Validation
Backend enforces:
- `images` is an array with `min:5` and `max:20` when provided
- Each item is a string

Controller: [ProjectController.php](file:///c:/laragon/www/portfolio/app/Http/Controllers/ProjectController.php)

## Admin Workflow

### Upload Photos (5–20)
Admin UI is in [AdminDashboard.vue](file:///c:/laragon/www/portfolio/resources/js/views/AdminDashboard.vue) under the Project modal:
- Drag-and-drop or click-to-select multiple files
- Supported formats: JPEG, PNG, WebP
- Size validation: 5MB max per file
- Preview grid with per-image remove and “Clear all”
- Upload runs during Save; progress bar reflects upload progress

Upload endpoint:
- `POST /api/admin/upload` (JWT protected)
- Accepts `folder=projects` to store in the project area

## Frontend Rendering

### Project Card Carousel
Component: [ProjectPhotoCarousel.vue](file:///c:/laragon/www/portfolio/resources/js/components/ProjectPhotoCarousel.vue)
- Auto-play with smooth transitions
- Pause on hover
- Dot navigation
- Touch swipe support
- “N of M” indicator
- Lazy loading + skeleton fallback

### Project Modal Gallery
View: [HomeView.vue](file:///c:/laragon/www/portfolio/resources/js/views/HomeView.vue)
- Responsive grid:
  - 1 column on mobile
  - 2 columns on small/tablet
  - 3 columns on desktop
- Each tile maintains a 16:9 aspect ratio
- Skeleton placeholders during image load

### Lightbox
Component: [PhotoLightbox.vue](file:///c:/laragon/www/portfolio/resources/js/components/PhotoLightbox.vue)
- Full-screen overlay
- Prev/Next buttons + keyboard arrow navigation
- Swipe navigation on touch
- Zoom:
  - Double-click toggles zoom
  - Mouse wheel zoom
  - Pinch zoom on touch (two-finger)
- Escape closes

## Accessibility
- All images include descriptive alt text derived from `project.title` and the photo index.
- Modals use `role="dialog"` / `aria-modal="true"` and close via ESC.
- Focus is moved into the modal/lightbox when opened.

## Testing

### Frontend (Vitest)
- [ProfilePicture.test.js](file:///c:/laragon/www/portfolio/resources/js/components/__tests__/ProfilePicture.test.js)
- [ProjectPhotoCarousel.test.js](file:///c:/laragon/www/portfolio/resources/js/components/__tests__/ProjectPhotoCarousel.test.js)
- [PhotoLightbox.test.js](file:///c:/laragon/www/portfolio/resources/js/components/__tests__/PhotoLightbox.test.js)

Run:
```bash
npm.cmd test -- --run
```

### Backend (PHPUnit)
- [ProjectPhotosTest.php](file:///c:/laragon/www/portfolio/tests/Feature/ProjectPhotosTest.php)

Run:
```bash
php artisan test
```

## Troubleshooting
- If routes don’t reflect recent changes, clear route cache:
```bash
php artisan route:clear
```
- If you see missing photos in production, confirm `FILESYSTEM_DISK` and (if using Supabase) the bucket/public URL configuration.

