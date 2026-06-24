# Prompt Gemini Fotos

Cloudflare-only static Next.js site for prompt-driven Gemini photo workflows.

## Architecture

- Next.js static export (`output: export`)
- Cloudflare Workers Assets for production routing
- Cloudflare DNS/routes for `promptgeminifotos.com` and `www.promptgeminifotos.com`
- No Vercel runtime
- No Supabase / NextAuth backend
- Plausible self-hosted analytics + Microsoft Clarity

## Commands

```bash
npm run build
npx wrangler@4 deploy --config wrangler.toml
```

The Worker redirects `/` to `/pt-BR/`; all static pages are served from `out/`.
