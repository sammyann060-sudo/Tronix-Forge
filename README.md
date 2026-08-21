# Tronix Forge

Tronix Forge is a TanStack Start application for building, deploying and managing Deriv-powered trading sites.

## Development

Install dependencies and run the app locally:

```sh
npm install
npm run dev
```

Required environment variables:

```sh
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
ADMIN_SECOND_PASSWORD=
```

## Database

Supabase migrations live in `supabase/migrations`. Apply them with the Supabase CLI or through the SQL editor before using the app.
