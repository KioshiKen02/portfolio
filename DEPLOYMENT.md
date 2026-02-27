# Deployment Guide: Laravel + Vue on Vercel & Supabase

This guide outlines the steps to deploy your Laravel (Backend) and Vue (Frontend) portfolio application using **Vercel** for hosting and **Supabase** for the PostgreSQL database.

## Prerequisites

1.  **GitHub Repository**: Ensure your project is pushed to a GitHub repository.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
3.  **Supabase Account**: Sign up at [supabase.com](https://supabase.com).

---

## Part 1: Supabase Setup (Database)

1.  **Create a Project**:
    - Go to the Supabase Dashboard and click "New Project".
    - Choose your organization, name your project (e.g., `portfolio-db`), and set a strong database password.
    - Select a region close to your target audience (and Vercel's region, usually `us-east-1` or `eu-central-1`).
    - Click **Create new project**.

2.  **Get Database Credentials**:
    - Once the project is active, go to **Settings (cog icon) > Database**.
    - Scroll down to the **Connection parameters** section.
    - Note down the following values (you will need them for Vercel):
        - **Host**
        - **Database**
        - **User**
        - **Port** (usually 5432 or 6543 for transaction pooler)
        - **Password** (the one you set in step 1)

3.  **Disable "Pause Project" (Optional/Note)**:
    - On the Free Tier, Supabase pauses projects after 7 days of inactivity. You will need to log in to the dashboard to unpause it if this happens.

---

## Part 2: Vercel Configuration

Your project has been pre-configured with `vercel.json` and `api/index.php` to run Laravel on Vercel's serverless infrastructure.

### 1. Import Project
1.  Go to the Vercel Dashboard and click **Add New... > Project**.
2.  Import your GitHub repository.
3.  **Framework Preset**: Select **Vite** (since your frontend is Vue/Vite).
4.  **Root Directory**: Keep as `./`.

### 2. Configure Build Settings
In the "Build & Development Settings" section:
- **Build Command**: Override and enter:
  ```bash
  npm run build
  ```
- **Output Directory**: Override and enter: `public`
- **Install Command**: Leave default (or empty).
  *Note: Do NOT include `composer` or `php` commands here. Vercel's build environment is Node.js-based. The `vercel-php` runtime will automatically install PHP dependencies (composer) during the deployment phase.*

### 3. Environment Variables
Add the following environment variables in the Vercel project settings:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `APP_ENV` | `production` | Production environment |
| `APP_DEBUG` | `false` | Disable debug mode |
| `APP_KEY` | `base64:...` | Run `php artisan key:generate --show` locally to get this |
| `APP_URL` | `https://your-project.vercel.app` | Your Vercel domain (update after deployment) |
| `DB_CONNECTION` | `pgsql` | Use PostgreSQL driver |
| `DB_HOST` | `aws-0-us-east-1.pooler.supabase.com` | From Supabase Settings |
| `DB_PORT` | `6543` | Use Transaction Pooler port (6543) for Serverless |
| `DB_DATABASE` | `postgres` | From Supabase Settings |
| `DB_USERNAME` | `postgres.xxx` | From Supabase Settings |
| `DB_PASSWORD` | `your-password` | Your DB Password |
| `DB_SSLMODE` | `require` | Required for Supabase |
| `JWT_SECRET` | `your-jwt-secret` | Run `php artisan jwt:secret --show` locally to get this |

**Important**: For Supabase on Serverless (Vercel), use the **Transaction Pooler** connection details (Port 6543, Mode: Transaction) to strictly manage connections.

---

## Part 3: Deployment & Database Migration

1.  **Deploy**: Click **Deploy** in Vercel.
2.  **Wait for Build**: Vercel will install Composer dependencies, NPM dependencies, build the Vue assets, and deploy the functions.
3.  **Run Migrations**:
    Since Vercel builds are read-only, you cannot easily run `php artisan migrate` during the build. You have two options:
    - **Option A (Recommended)**: Connect to your Supabase database from your local machine (update your local `.env` with Supabase credentials temporarily) and run:
      ```bash
      php artisan migrate --force
      ```
    - **Option B**: Use a migration route (insecure) or a separate management script. Sticking to Option A is safer.

---

## Part 4: Connecting Frontend to Backend

Your `resources/js/bootstrap.js` is already configured to look for `/api`:
```javascript
window.axios.defaults.baseURL = '/api';
```
Since the frontend and backend are hosted on the same domain (the Vercel app), this relative path will work automatically without CORS issues.

---

## Part 5: Verification & Testing

1.  **Visit the URL**: Open your Vercel deployment URL. You should see your Vue application.
2.  **Test API**: Open DevTools > Network and ensure requests to `/api/...` are returning 200 OK.
3.  **Test Auth**: Try to log in or register. If it fails, check Vercel Logs (Runtime Logs) for error details (often related to DB connection or Missing Env Vars).

## Troubleshooting Common Issues

-   **500 Server Error**: Check Vercel Function Logs.
    -   *Database Connection Failed*: Check `DB_HOST`, `DB_PASSWORD`, and ensure `DB_SSLMODE=require`.
    -   *Class not found*: Ensure `composer install` ran correctly.
-   **404 Not Found on Refresh**: Single Page Applications (SPA) need a rewrite rule. The provided `vercel.json` handles this by routing everything to `api/index.php` which loads Laravel, and Laravel should be configured to return the main view for unknown routes (or you can adjust `vercel.json` to serve `index.html` for non-API routes if you prefer pure SPA routing).
    -   *Current Setup*: Requests go to Laravel. Laravel's `web.php` should have a catch-all route to serve the Vue app view.
    -   **Action Required**: Ensure `routes/web.php` has a fallback:
        ```php
        Route::get('/{any}', function () {
            return view('app'); // or 'welcome'
        })->where('any', '.*');
        ```

## Free Tier Limitations & Security

-   **Supabase**:
    -   Database pauses after 7 days of inactivity.
    -   500MB database size limit.
-   **Vercel**:
    -   Serverless Function execution timeout (usually 10s on free tier). Heavy tasks should be moved to Queues (which are hard to run on Vercel Free).
    -   Bandwidth limits.
-   **Security**:
    -   Ensure `APP_DEBUG` is `false`.
    -   Use strong `APP_KEY` and `JWT_SECRET`.
    -   Supabase enforces SSL, which is good.

