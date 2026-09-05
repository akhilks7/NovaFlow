# NovaFlow

Workflow automation with a two-tier role model, built on the Next.js 16 App
Router and Supabase.

- **Members** create and manage their own workflows, and edit their own profile.
- **Administrators** do all of that, plus full CRUD over every account in the
  directory.

Permissions are enforced twice: once in the app, and again by Postgres row level
security, so a forged request fails at the database rather than at the button.

## Setup

### 1. Environment

Copy `.env.example` to `.env.local` and fill it in from your Supabase project
under **Project settings → API**:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Browser + server client |
| `SUPABASE_SERVICE_ROLE_KEY` | for account CRUD | Lets admins create and delete accounts |

The service-role key bypasses row level security and is only ever read on the
server, in `src/utils/supabase/admin.ts`. Without it the app runs fine — admins
can still change roles and statuses, but the *create* and *delete* actions are
disabled with an explanation in the UI.

### 2. Migrations

Three migration files live in `supabase/migrations/`, in order:

1. `…_init_identity_and_roles.sql` — `profiles`, the `app_role` enum, RLS
   policies, and the triggers that provision a profile per auth user and guard
   role changes.
2. `…_workflows_and_activity.sql` — `workflows` and the append-only
   `activity_log` that feeds the dashboard.
3. `…_avatars_storage.sql` — the public `avatars` bucket and its ownership
   policies.

Apply them with the CLI:

```bash
supabase db push
```

Or paste each file, in filename order, into the SQL editor in the dashboard.

### 3. First account

Sign up at `/signup`. **The first account created becomes the administrator**;
every account after that is a member. From `/admin/users` an admin can add
people, change roles and statuses, and delete accounts.

### 4. Run it

```bash
npm run dev
```

## How it fits together

```
src/
  app/
    (marketing)/       public landing page
    (auth)/            sign in, sign up, password reset
    auth/confirm/      exchanges emailed one-time tokens for a session
    (app)/             authenticated shell — dashboard, workflows, profile, settings
      admin/           role-gated member management
  components/          UI, split by feature
  utils/
    supabase/          browser, server, service-role clients + session refresh
    auth/dal.ts        the one place the app asks "who is asking?"
    */actions.ts       Server Actions, one module per feature
```

- `src/proxy.ts` refreshes Supabase cookies on every request and performs an
  *optimistic* redirect. It never touches the database.
- Real authorization happens in `src/utils/auth/dal.ts`, which re-verifies the
  user with `supabase.auth.getUser()` on every render.
- Server Actions return expected failures as values for `useActionState`; only
  bugs throw, and those land in the nearest `error.tsx`.

## Design

One hand-authored stylesheet, `src/app/globals.css` — no utility framework and
no runtime CSS-in-JS. It defines an Apple-style frosted-glass system: layered
`backdrop-filter` surfaces over a drifting mesh gradient, hairline borders with
a specular inner highlight, and Apple's easing curve on every transition.

Light and dark are both first-class. The preference is stored in a cookie and
read on the server, so the correct palette is in the very first byte of HTML —
no blocking script, no flash of the wrong theme. Leaving it on *System* follows
the device via `prefers-color-scheme`.

Every layout is fluid rather than breakpoint-driven: `clamp()` type scales,
auto-fitting grids, a sidebar that becomes a drawer below 1024px, and tables
that reflow into labelled cards below 860px. `prefers-reduced-motion` is
honoured throughout.

## Checks

```bash
npm run lint
npm run build
```
