

# Pre-Launch Polish: Bookmarks, PWA, and SEO

This plan bundles three features to get the app ready for publishing.

---

## 1. Bookmark / Save Feature (localStorage-based)

Since the app is fully anonymous (no accounts), bookmarks will be stored in the browser's localStorage.

**New files:**
- `src/hooks/useBookmarks.ts` -- A custom hook that manages an array of bookmarked confession IDs in localStorage, with `toggle`, `isBookmarked`, and `bookmarkedIds` utilities.

**Modified files:**
- `src/components/ConfessionCard.tsx` -- Add a Bookmark icon button (using `lucide-react`'s `Bookmark` / `BookmarkCheck`) next to the Share button. Clicking it toggles the bookmark via the hook and shows a toast confirmation.
- `src/pages/Index.tsx` -- Add a "Saved" tab/toggle in the feed toolbar area so users can filter to only their bookmarked confessions.
- `src/components/ConfessionFeed.tsx` -- Accept an optional `bookmarkedIds` filter prop. When the "Saved" view is active, filter the fetched confessions to only show those whose IDs are in the bookmarked list.

---

## 2. PWA Support

Make the app installable from the browser on mobile and desktop.

**New dependency:**
- `vite-plugin-pwa` -- Handles service worker generation and manifest injection.

**Modified files:**
- `vite.config.ts` -- Add `VitePWA` plugin with:
  - A web app manifest (name, short_name, icons, theme_color, background_color, display: standalone).
  - `navigateFallbackDenylist: [/^\/~oauth/]` for safety.
  - Workbox runtime caching for API calls and assets.
- `index.html` -- Add `<link rel="manifest">` and Apple-specific meta tags (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`).

**New files:**
- `public/icon-192.png` and `public/icon-512.png` -- PWA icons (generated from the existing `favicon.png` or `logo.png`). Since we can't generate images, we'll reference `favicon.png` at both sizes in the manifest for now; the user can replace them with properly sized icons later.

---

## 3. SEO Meta Tag Enhancements

The existing `index.html` already has solid OG/Twitter tags. The improvements will be:

**Modified files:**
- `index.html`:
  - Add `<meta name="keywords">` with relevant terms (anonymous confessions, secret sharing, etc.).
  - Add `<meta name="application-name" content="Confess">`.
  - Add `apple-mobile-web-app-title` meta tag.
  - Ensure the `<link rel="manifest">` points to the PWA manifest.
  - Add `<meta name="format-detection" content="telephone=no">` to prevent auto-linking on mobile.

No changes are needed to the OG image, Twitter card, or JSON-LD -- those are already well-configured.

---

## Technical Details

### Bookmark hook implementation
```typescript
// useBookmarks.ts
const STORAGE_KEY = 'confess-bookmarks';

function getBookmarks(): string[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// Returns { bookmarkedIds, isBookmarked(id), toggle(id) }
```

### PWA Vite config addition
```typescript
import { VitePWA } from 'vite-plugin-pwa';

VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Confess - Anonymous Confession Wall',
    short_name: 'Confess',
    theme_color: '#1a1a2e',
    background_color: '#1a1a2e',
    display: 'standalone',
    icons: [
      { src: '/favicon.png', sizes: '192x192', type: 'image/png' },
      { src: '/favicon.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  workbox: {
    navigateFallbackDenylist: [/^\/~oauth/],
  },
})
```

### File change summary
| File | Action |
|------|--------|
| `src/hooks/useBookmarks.ts` | Create |
| `src/components/ConfessionCard.tsx` | Edit (add bookmark button) |
| `src/components/ConfessionFeed.tsx` | Edit (accept bookmark filter) |
| `src/pages/Index.tsx` | Edit (add Saved toggle) |
| `vite.config.ts` | Edit (add PWA plugin) |
| `index.html` | Edit (add PWA + SEO meta tags) |

