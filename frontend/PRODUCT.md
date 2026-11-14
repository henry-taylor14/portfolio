# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary now: hiring managers and technical recruiters** evaluating Henry Taylor for a full-time role. They skim fast, want proof of shipped work, and decide whether to reach out.
- **Long-term: consulting clients**, meaning businesses that want web apps, AI features, or automation workflows built for them. Not the lead audience yet, but every page should already work for them.
- Secondary: peers and curious visitors arriving via posts, GitHub, or LinkedIn.

## Product Purpose

Personal portfolio for Henry Taylor. Near-term goal: land a new job. Long-term goal: build a consulting practice so Henry no longer needs a job. Success now = hiring-manager outreach through the contact form or LinkedIn. Success later = qualified project inquiries.

## Positioning

Full-stack and AI engineer who builds web apps, AI features, and custom automation workflows (AI, Python, n8n) that remove manual work. The automation work is the bridge between the two goals: breadth for employers, a ready-made consulting offer for clients.

## Operating Context

- Content is managed in Sanity Studio (`studio/`), with pages, posts, person, settings, timeline, info sections, and CTAs. Frontend is Next.js 15 App Router + Tailwind 4 on Vercel.
- Routes: home, `/about` (timeline), `/posts` (projects), `/posts/[slug]`, `/contact` (Resend email, honeypot field), page-builder `[slug]` pages.
- Visitors evaluate from a link in an application, résumé, or LinkedIn, often on a phone, in a short sitting.

## Capabilities and Constraints

- **Posts are project case studies.** Write each one as problem → what was built → result, so one case study serves both hiring managers and future clients.
- **Clappy** (`app/components/Clappy.tsx`, `app/api/clappy/route.ts`): an AI chat character backed by Hugging Face Llama-3.2-3B, rate-limited and with a 500-char message cap. Its persona changes per page. Planned: on the projects pages Clappy becomes a librarian/curator of Henry's skills and work, helpful rather than annoying. Elsewhere it stays playful and chaotic.
- **Planned:** the contact form asks the visitor's intent (Hiring / Project inquiry / Just saying hi) so client leads collect from day one.
- **Pivot plan:** when consulting becomes the focus, change the home message and main CTA from "hire me" to "work with me" and add a Services page built from the automation case studies. Same site, same domain.
- **Decided against for now:** a separate subdomain per audience. It splits content and SEO and doubles maintenance without evidence of need. Revisit only if the two audiences prove to need different sites.

## Brand Commitments

- Name: **Henry Taylor**. "Herota Tech" is the personal brand name for the site, not a separate business.
- Voice: playful and personable, with real substance underneath. Personality is a feature (Clappy), but proof of competence comes first for the hiring audience.

## Evidence on Hand

- Real headshot: `public/images/headshot.jpg`. Logo/wordmark: `public/images/full.svg`, `HerotaIcon`, `HerotaText`.
- GitHub and LinkedIn links (components in `app/components/`).
- Project case studies and timeline entries live in Sanity.
- **No testimonials, client names, or metrics exist yet.** Never fabricate quotes, clients, logos, numbers, or outcomes.

## Product Principles

1. **Proof before personality.** A hiring manager should find shipped work within one scroll. Charm supports that, never delays it.
2. **One body of work, two readers.** Frame every project by problem solved and result, so the same content persuades an employer today and a client tomorrow.
3. **Build for the pivot, don't build the pivot.** Keep the client path open (contact intent, automation work given weight) without adding services pages or subdomains before they're needed.
4. **Honest evidence only.** Show what's real; leave gaps visible rather than filled with invented social proof.
