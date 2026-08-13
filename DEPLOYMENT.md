# Cloudflare Pages Production Setup

## Build Settings

- Build command: `npm run build`
- Build output directory: `dist`
- Functions directory: `functions`
- Compatibility date: `2026-08-04`

## Supabase

Apply the SQL migration before routing production traffic:

```bash
supabase/migrations/*.sql
```

The migration enables RLS and grants `anon` insert-only access to:

- `career_assessment_leads`
- `career_assessment_delivery_events`

There is no public `SELECT`, `UPDATE`, or `DELETE` grant.

## Cloudflare Environment Variables

Set these as Cloudflare Pages variables:

```env
SUPABASE_URL=https://uyccjtzxlgpyczbucjkq.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_lWAXhhDqiEFh5YN6CNrFmw_vBvx05ct
WATI_API_ENDPOINT=https://live-mt-server.wati.io
WATI_CHANNEL=
ALLOWED_ORIGINS=https://your-production-domain.com,https://your-project.pages.dev,https://*.your-project.pages.dev,https://brototype.com,https://www.brototype.com
REGISTER_DEBUG=0
TEST_MODE=0
```

Set this as an encrypted Cloudflare secret:

```env
WATI_API_KEY=...
SALESMAX_LEADS_URL=...
```

Rotate the WATI key that was shared in chat, then use the rotated key in Cloudflare.

## Local Testing

Use the ignored `.dev.vars` file for local secrets, then run:

```bash
npm run cf:dev
```

For safe local API testing without sending WhatsApp messages, set:

```env
TEST_MODE=1
```

Set `REGISTER_DEBUG=1` only while debugging locally. Do not enable it in production unless you are actively investigating an incident.
