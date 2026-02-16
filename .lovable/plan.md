

# Pre-Publish Bug Review and Fixes

After a thorough audit of the codebase, here are the issues found, ranked by severity.

---

## 1. CRITICAL: Regex Spam Detection Bug (stateful regex)

**File:** `src/lib/profanity.ts` (lines 26-34)

The `spamPatterns` array uses regex literals with the `g` flag. In JavaScript, regex objects with `g` are **stateful** -- they remember `lastIndex` between `.test()` calls. This means the spam check alternates between true/false for the same input, causing confessions to randomly pass or fail the spam filter.

**Fix:** Remove the `g` flag from the URL and spam-keyword patterns since `.test()` doesn't need it, or recreate the regex each call.

---

## 2. HIGH: Vote Race Condition

**File:** `src/hooks/useConfessions.ts` (lines 146-192)

The vote logic does a read-then-write: it reads the current upvote/downvote counts, adjusts them locally, then writes back. If two users vote at the same time, one vote can be silently lost. 

**Fix:** Use a database function (RPC) or at minimum use Supabase's `.rpc()` to atomically increment/decrement counts instead of read-modify-write from the client. This is a longer fix but important for data integrity.

---

## 3. HIGH: Overly Permissive RLS Policies (9 warnings)

The database linter found 9 RLS policies using `WITH CHECK (true)` or `USING (true)` for INSERT/UPDATE/DELETE. This means **anyone** can insert, update, or delete any row in your tables (confessions, votes, reports, replies, post_limits). A malicious user could:
- Delete other people's confessions
- Manipulate vote counts directly
- Bypass rate limits by deleting their `post_limits` rows

**Fix:** Tighten RLS policies. Since the app uses fingerprints (not auth), policies should at minimum restrict UPDATE/DELETE to rows matching the user's fingerprint. For example:
- `confessions`: Allow INSERT with check true (anonymous), but restrict UPDATE to admins only.
- `votes`: Allow INSERT/DELETE only where `fingerprint` matches.
- `post_limits`: Allow INSERT/UPDATE only where `fingerprint` matches, deny DELETE.

---

## 4. MEDIUM: Saved Tab Shows Empty State Incorrectly

**File:** `src/components/ConfessionFeed.tsx` (lines 54-57)

When the user switches to "Saved" tab but has bookmarked confessions that haven't been fetched yet (e.g., they're on a later page), those bookmarked confessions won't appear. The bookmark filter only works on **already-loaded** pages. This can confuse users who bookmarked something, scrolled away, and come back to find their "Saved" tab empty.

**Fix:** Show a distinct empty message for the Saved tab (e.g., "No saved confessions yet") vs. the generic "The Wall is Empty..." message.

---

## 5. MEDIUM: Fingerprint Weakness

**File:** `src/lib/fingerprint.ts`

The fingerprint hash is a simple 32-bit hash that produces short strings (e.g., "1a2b3c"). Collision probability is high -- different users with similar browsers will get the same fingerprint, sharing their vote history and rate limits. 

**Fix:** Use `crypto.subtle.digest('SHA-256', ...)` for a proper hash with negligible collision probability.

---

## 6. LOW: OG/Canonical URLs Are Hardcoded

**File:** `index.html` (lines 16, 23-24, 34)

The canonical URL and OG URLs are hardcoded to `https://confess.lovable.app/`. If you publish to a custom domain, these won't match, which hurts SEO.

**Fix:** Update these URLs to match your actual published domain before or after connecting a custom domain.

---

## 7. LOW: No Debounce on Search

**File:** `src/components/ConfessionFeed.tsx` (line 72)

The search input fires a new database query on every keystroke (`onChange`). This creates unnecessary load and flickering results.

**Fix:** Add a debounce (300-500ms) before triggering the query.

---

## Recommended Priority for Fixes

| Priority | Issue | Effort |
|----------|-------|--------|
| 1 | Regex spam bug (stateful `g` flag) | 5 min |
| 2 | Saved tab empty state message | 10 min |
| 3 | Search debounce | 10 min |
| 4 | Fingerprint hash upgrade (SHA-256) | 15 min |
| 5 | RLS policy tightening | 30 min |
| 6 | Vote race condition (atomic RPC) | 30 min |
| 7 | OG URL update | 5 min (after domain setup) |

---

## Technical Details

### Fix 1: Stateful regex
```typescript
// BEFORE (buggy)
const spamPatterns = [
  /(.)\1{4,}/i,
  /(https?:\/\/[^\s]+)/gi,   // <-- g flag is stateful
  /\b(buy|click|free|winner|lottery|prize)\b/gi,
];

// AFTER (fixed)
const spamPatterns = [
  /(.)\1{4,}/i,
  /https?:\/\/[^\s]+/i,      // removed g flag
  /\b(buy|click|free|winner|lottery|prize)\b/i,
];
```

### Fix 4: SHA-256 fingerprint
```typescript
const encoder = new TextEncoder();
const data = encoder.encode(str);
const hashBuffer = await crypto.subtle.digest('SHA-256', data);
const hashArray = Array.from(new Uint8Array(hashBuffer));
return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
```

### Fix 5: Example tighter RLS policy for votes
```sql
-- Only allow inserting votes (no direct update/delete of others' votes)
CREATE POLICY "votes_insert" ON votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "votes_delete_own" ON votes  
  FOR DELETE USING (fingerprint = current_setting('request.headers')::json->>'x-fingerprint');
```
Note: Since there's no auth, fingerprint-based RLS is limited. The real protection comes from the client code, but tightening UPDATE/DELETE on `confessions` to admin-only is still worthwhile.

