# Handoff: `@pluto-khronos/types` 0.3.0 — Playoff series schema + auto-release workflow

**Session**: Claude code session (branch `claude/playoff-series-types-cPgXe`)  
**PR**: https://github.com/fearandesire/pluto-khronos-types/pull/2  
**Status**: Ready for manual follow-up (token setup + merge)

---

## What's Done

### Phase 1: Schema Extensions (Commit `485ade1`)

**File**: `src/schemas/sports.ts`

Added:
- `teamRecordSchema`: now has `display_name`, `abbreviation`, `home_record`, `away_record`, `playoff_record` (all `.optional()`), and `total_record` widened from `z.string()` to `z.string().nullable()`.
- New `matchupSeriesSchema` with optional `round`, `summary`, `home_wins`, `away_wins`, `total_games`, `completed`.
- `teamRecordsResultSchema` gains optional nullable `series` field.
- New `MatchupSeries` type export.

**File**: `package.json`

- Bumped version from `0.2.4` to `0.3.0` (minor bump because `total_record` nullability widening is a contract change; additive `.optional()` fields are safe).

**Why**: Unblocks [khronos PR #576](https://github.com/fearandesire/khronos/pull/576), which emits the richer payload Pluto's bot already accepts but was type-red against the published `0.2.4` types.

---

### Phase 2: Release CI (Commit `6042248`)

**File**: `.github/workflows/release.yml` (new)

Tag-triggered workflow (now superseded by Phase 3).

**File**: `package.json` (scripts)

Added `lint`, `preversion`, `postversion`, `release:patch|minor|major` scripts.

**Status**: Superseded by Phase 3 (see below).

---

### Phase 3: Auto-release Workflow (Commit `745d8a2`)

**File**: `.github/workflows/release.yml` (rewritten)

**Trigger**: `push: branches: [main]` (merge-triggered).

**Flow**:
1. Read version from `package.json`.
2. If `v{version}` tag exists → skip (idempotent; safe on retries).
3. If `v{version}` already on npm → skip publish, just tag + release (recovery path for partial failures).
4. Otherwise: build → type-check → lint → docs → publish with provenance → tag → create GitHub release.

**Key features**:
- **Provenance attestation** via `id-token: write` — published package shows the GitHub commit/run that built it.
- **Concurrency group `release`** — serialises simultaneous merges so tag writes don't race.
- **Auto-generated GitHub release notes** from PR metadata since last tag.

**File**: `package.json` (scripts, rewritten)

**Removed**: `preversion`, `postversion`, `release:patch|minor|major` (were tag-pushing scripts; obsolete in merge-triggered flow).

**Added**:
- `bump:patch`, `bump:minor`, `bump:major` — `npm version --no-git-tag-version` helpers (bump file only, no commit/tag; dev includes in feature PR).
- `lint` — `biome check .` (read-only; gated in the workflow).

---

## What Needs to Happen Next

### 1. Add `NPM_TOKEN` secret (one-time, **required before merge**)

```bash
# Create an npm automation token at https://www.npmjs.com/settings/{username}/tokens
# - Type: Granular Access Token (or Classic Automation)
# - Permissions: Read and write on @pluto-khronos/types
# - No expiry or pick your preference

# Option A: GitHub UI
# https://github.com/fearandesire/pluto-khronos-types/settings/secrets/actions
# → New repository secret
# → Name: NPM_TOKEN
# → Paste the token

# Option B: CLI (if gh auth is set up locally)
gh secret set NPM_TOKEN --repo fearandesire/pluto-khronos-types
# (paste token when prompted)
```

**Without this secret, the Release workflow will fail at the publish step.**

### 2. Review and merge PR #2

- Title: `feat: playoff series schema (0.3.0) + auto-release workflow`
- Contains 3 commits (schema + Phase 2 + Phase 3)
- Once merged, the Release workflow auto-triggers and publishes `0.3.0` to npm

### 3. Verify the publish

```bash
npm view @pluto-khronos/types version
# Should return 0.3.0

# Check GitHub release
# https://github.com/fearandesire/pluto-khronos-types/releases/tag/v0.3.0
# Should have auto-generated notes listing merged PRs since the previous tag
```

### 4. Downstream: bump khronos and Pluto

- **khronos**: Update `apps/api/package.json` `@pluto-khronos/types` to `^0.3.0`. khronos PR #576 should then go green.
- **Pluto-Betting-Bot**: Dependabot will pick it up on the next weekly run (no manual action needed).

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| **Merge-triggered release** | Merging a PR → auto-publishes. Zero post-merge action. Future: add `bump:*` script to feature PR, merge → done. |
| **0.3.0 (not 0.2.5)** | `total_record` nullability widening is a contract change. Pre-1.0 semver: minor bump signals it. Additive `.optional()` fields are safe. |
| **No release-please yet** | Single-package, infrequent releases. The manual `bump:*` approach is simpler. Can layer release-please later if needed. |
| **Auto-generated release notes** | `--generate-notes` lists merged PRs since last tag. Sufficient for now; could add release-drafter later. |
| **Tag-exists short-circuit** | Prevents republish on every README merge. Idempotent: safe to rerun workflow if it partially fails. |
| **npm-version-exists check** | Recovery path if publish succeeds but tag-push fails (rare). Skip publish, just tag + release. |

---

## Files Changed

```
.github/workflows/release.yml    # 109 lines, new merge-triggered workflow
src/schemas/sports.ts             # Schema extensions (teamRecordSchema, matchupSeriesSchema, teamRecordsResultSchema, MatchupSeries)
package.json                       # Version bump (0.2.4 → 0.3.0), script updates (bump:*, removed release:*)
```

---

## Testing Checklist (Before Ship)

- [x] `bun run build` passes
- [x] `bun run type-check` passes
- [x] `bun run lint` passes
- [x] `bun run docs` passes
- [x] Pre-commit `lefthook` hook passes
- [x] Schema exports (`matchupSeriesSchema`, `MatchupSeries`) in `dist/schemas/sports.d.ts`
- [ ] `NPM_TOKEN` secret added to repo
- [ ] PR #2 merged
- [ ] `npm view @pluto-khronos/types version` returns `0.3.0`
- [ ] khronos PR #576 bumped to `^0.3.0` and goes green
- [ ] Pluto-Betting-Bot Dependabot picks it up (weekly cycle)

---

## Future Enhancements (Out of Scope)

- **release-please**: Auto-generate version-bump PRs from conventional commits. For a multi-package monorepo or high-velocity releases.
- **release-drafter**: Richer auto-changelog generation (group PRs by label, exclude bot PRs, etc.).
- **PR-trigger CI**: Build + lint + type-check on every PR (lefthook + workflow gates already cover this locally; nice-to-have).

---

## References

- **Schema consumer**: [khronos PR #576](https://github.com/fearandesire/khronos/pull/576) — emits the wider `MatchupRecords` payload
- **Consumer schema**: Pluto-Betting-Bot `src/utils/cache/data/schemas.ts:22-44` — already accepts the richer shape
- **Plan file**: `/root/.claude/plans/prd-extend-lexical-cat.md` (three phases documented)

---

## Quick Start (From Local)

```bash
# Pull the branch
git fetch origin claude/playoff-series-types-cPgXe:claude/playoff-series-types-cPgXe
git checkout claude/playoff-series-types-cPgXe

# Add the NPM_TOKEN secret (GitHub UI or gh CLI)
# Then:

# Mark PR ready for review + merge
# The Release workflow auto-triggers on merge to main
# npm view @pluto-khronos/types version → check 0.3.0

# Downstream:
# khronos: bump @pluto-khronos/types to ^0.3.0 in apps/api/package.json
# Pluto: Dependabot will handle it
```

---

**Session ID**: 01TM6ZtgBvF6q7xEzGxvqtBB  
**Created**: 2026-05-13  
**Status**: Awaiting NPM_TOKEN secret + merge
