# Whisper Wall

Anonymous confession wall built with Vite, React, TypeScript, Supabase, shadcn/ui, and Tailwind CSS.

## Local development

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Project structure

- `src/pages` contains route-level screens.
- `src/components` contains shared UI and feature components.
- `src/hooks` contains data-fetching and interaction hooks.
- `src/integrations/supabase` contains the generated Supabase client and types.
- `public/sitemap.xml` and `public/robots.txt` control crawler discovery.
