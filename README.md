# Amaka Ikpeazu: portfolio and Kova

My portfolio site, built around Kova, a customer health product I made up so I could show real work
without breaking client confidentiality. The data is fictional. The code, API and integrations are real.

## What's in here

- `/` the portfolio homepage
- `/kova` the Kova sandbox. Every visitor gets their own account (Brightline Logistics) and API key
- `/kova/docs` the API reference
- `/api/...` the API itself

How it works: events come in (from the dashboard buttons or from real API calls). Kova replays the
account's history, rescores it, and if the account drops a band (healthy, at risk, critical) it writes
an alert and sends it through n8n or Resend. Every outbound call shows in the integration log.

## 1. Try it on your own computer (no accounts needed)

You need Node.js 18 or later (nodejs.org).

```
npm install
npm run dev
```

Open http://localhost:3000. With no keys set, data lives in memory and alerts show on screen.

## 2. Put it online

**Supabase (the database), free**
1. Create a project at supabase.com.
2. SQL Editor > New query > paste everything from `supabase/schema.sql` > Run.
3. Project Settings > API: copy the Project URL and the `service_role` key.
   The service role key is a secret: it only ever goes into Vercel's settings, never into the code.

**Vercel (the hosting), free**
1. Put this folder in a GitHub repository.
2. At vercel.com, Add New > Project > import the repository.
3. Before deploying, add these environment variables:
   - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from Supabase
4. Deploy. You'll get a link like `your-project.vercel.app`. Add your own domain under Settings > Domains.

## 3. Turn on the integrations

Add each of these in Vercel (Settings > Environment Variables), then redeploy.

**AI summaries and QBR drafts**
- `ANTHROPIC_API_KEY` from console.anthropic.com. Set a monthly spend limit there too.
- Without it, Kova uses its own templates and the log says so.

**Alert emails through n8n (recommended, it shows off the workflow)**
1. In n8n, Import from file > `n8n/kova-alert-workflow.json`.
2. Open "Email the CSM" and connect your Gmail account.
3. Activate the workflow and copy the production webhook URL from the first node.
4. Set `N8N_WEBHOOK_URL` to that URL.

**Or alert emails straight through Resend**
- `RESEND_API_KEY` from resend.com and `ALERT_FROM_EMAIL`.
- To email visitors (not just yourself), verify your own domain in Resend first.

If both are set, Kova tries n8n first and falls back to Resend.

**Limits**
- `MAX_ALERT_EMAILS_PER_DAY` (default 50) caps outgoing email.
- The API also limits each key to 30 events, 120 reads and 4 QBR drafts a minute.

## 4. Make it yours

Edit `lib/site.ts`: your email, LinkedIn, CV link and demo video.
Put `cv.pdf` and `demo.mp4` in the `public` folder and point the settings at `/cv.pdf` and `/demo.mp4`.
Anything left empty is hidden.

## Housekeeping

Sandboxes expire after 7 days. To delete old ones and their email addresses automatically, enable
pg_cron in Supabase and run the scheduled delete at the bottom of `supabase/schema.sql`.
