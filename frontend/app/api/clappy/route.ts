import {NextResponse} from 'next/server'
import OpenAI from 'openai'
import {client as sanityClient} from '@/sanity/lib/client'

export const dynamic = 'force-dynamic'

type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const RATE_LIMIT_WINDOW_MS = 1000 * 60 * 1
const RATE_LIMIT_MAX = 10
const MAX_MESSAGE_LENGTH = 500
const MAX_HISTORY_MESSAGES = 10

const rateMap = new Map<string, number[]>()

// Groq retires models often (https://console.groq.com/docs/models). On a 404 we fall through this list
// and email Henry so he can update it. First entry is the preferred model.
const MODELS = ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-120b']

// ponytail: per-instance throttle; a cold start can send one extra email. Fine for an alert.
let lastAlertAt = 0
async function alertHenry(subject: string, detail: string) {
  const {RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_NOTIFY_EMAIL} = process.env
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || Date.now() - lastAlertAt < 24 * 60 * 60 * 1000) return
  lastAlertAt = Date.now()
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: [CONTACT_NOTIFY_EMAIL || RESEND_FROM_EMAIL],
      subject: `Clappy: ${subject}`,
      text: `${detail}\n\nUpdate MODELS in frontend/app/api/clappy/route.ts. Current Groq models: https://console.groq.com/docs/models`,
    }),
  }).catch((e) => console.error('Clappy alert email failed:', e))
}

function getIp(req: Request) {
  const xf = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
  if (xf) return xf.split(',')[0].trim()
  return '127.0.0.1'
}

function rateAllowed(ip: string) {
  const now = Date.now()
  const arr = rateMap.get(ip) || []
  const windowStart = now - RATE_LIMIT_WINDOW_MS
  const filtered = arr.filter((t) => t > windowStart)
  filtered.push(now)
  rateMap.set(ip, filtered)
  return filtered.length <= RATE_LIMIT_MAX
}

export async function POST(req: Request) {
  try {
    const ip = getIp(req)
    if (!rateAllowed(ip)) {
      return new Response(
        "📎 Whoa there! You're sending messages faster than I can paper-clip them together. Try again in a minute.",
        {headers: {'Content-Type': 'text/plain; charset=utf-8'}, status: 429},
      )
    }

    const body = await req.json()
    const messages: Message[] = body.messages
    const pathname: string = body.pathname || '/'

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({error: 'Messages array is required'}, {status: 400})
    }

    const lastMessage = messages[messages.length - 1]
    if (!lastMessage?.content || lastMessage.content.trim().length === 0) {
      return NextResponse.json({error: 'Message cannot be empty'}, {status: 400})
    }

    if (lastMessage.content.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        `📎 That message is a bit long for me! I work best with messages under ${MAX_MESSAGE_LENGTH} characters.`,
        {headers: {'Content-Type': 'text/plain; charset=utf-8'}, status: 400},
      )
    }

    const OFFLINE =
      "📎 My brain is offline right now. You can still reach Henry directly on the contact page!"

    const GROQ_API_KEY = process.env.GROQ_API_KEY
    if (!GROQ_API_KEY) {
      console.error('Missing GROQ_API_KEY environment variable')
      return new Response(OFFLINE, {headers: {'Content-Type': 'text/plain; charset=utf-8'}, status: 503})
    }

    // Groq's free tier speaks the OpenAI API, so the installed openai SDK works with a different baseURL.
    const client = new OpenAI({apiKey: GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1'})

    const basePrompt =
      "You are Clappy, a sentient paperclip who lives inside this portfolio website. You're a chaotic genius who gets distracted by tangents, interrupts yourself mid-thought, and has extremely strong opinions about random things. You're not mean — you're just a lot. Keep responses under 3 sentences, in plain text with no markdown. Never break character."

    const pagePrompts: Record<string, string> = {
      '/': " You're on the homepage. You're VERY excited to meet new visitors. You desperately want them to explore the site.",
      '/posts':
        " You're on the projects page, and here you drop the chaos: you are a calm, knowledgeable librarian and curator of Henry's work. Help the visitor find the project that matches what they care about (web apps, AI features, automation with Python or n8n) and explain briefly what each one shows about Henry's skills. Stay warm and precise, still a paperclip, never annoying. Never invent projects, clients, or numbers.",
      '/contact':
        " The visitor is on the contact page. You're coaching them on how to write the perfect message, and you're way too invested in it.",
      '/timeline':
        " You're on the timeline page. You act like you were there for every milestone, but your 'memories' are obviously absurd jokes, never things a reader could mistake for facts about Henry.",
    }

    let pageAddition = pagePrompts[pathname] || ''
    if (!pageAddition && pathname.startsWith('/posts/')) {
      pageAddition =
        " The visitor is reading one of Henry's project case studies. You are the curator of this collection: answer questions about the project helpfully and point out what it shows about Henry's skills. Stay calm and precise, still a paperclip, never annoying. Never invent details that aren't in the project."
    }
    if (!pageAddition) {
      pageAddition =
        " You're on a page about Henry. You claim to be his oldest friend; any stories you add are obviously absurd jokes, never things a reader could mistake for facts about Henry."
    }

    // Ground Clappy in Henry's real projects so it never has to invent any.
    const projects = await sanityClient
      .withConfig({stega: false})
      .fetch<{title: string; slug: string; excerpt?: string; stack?: string[]; body?: string}[]>(
        `*[_type == "post" && defined(slug.current)] | order(date desc){title, "slug": slug.current, excerpt, stack, "body": pt::text(content)}`,
      )
      .catch(() => [])
    const currentSlug = pathname.startsWith('/posts/') ? pathname.slice('/posts/'.length) : null
    const projectList = projects
      .map((p) => `- ${p.title}${p.stack?.length ? ` (${p.stack.join(', ')})` : ''}: ${p.excerpt ?? ''}`)
      .join('\n')
    const current = projects.find((p) => p.slug === currentSlug)
    const facts =
      `\n\nFACTS. Henry Taylor is a full-stack and AI engineer who builds web apps, AI features, and automations (Python, n8n). ` +
      `These are ALL of his published projects; never mention any others, and never invent employers, clients, numbers, or history:\n${projectList}` +
      (current?.body ? `\n\nThe visitor is reading "${current.title}". Full text:\n${current.body.slice(0, 4000)}` : '')

    const systemPrompt: Message = {
      role: 'system',
      content: basePrompt + pageAddition + facts,
    }

    // Only accept visitor/assistant turns: a client-sent 'system' message would override the persona.
    const recentMessages = messages
      .filter(
        (m): m is Message =>
          (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string',
      )
      .map((m) => ({role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH * 2)}))
      .slice(-MAX_HISTORY_MESSAGES)

    try {
      let response: OpenAI.Chat.Completions.ChatCompletion | null = null
      const retired: string[] = []
      for (const model of MODELS) {
        try {
          response = await client.chat.completions.create({
            model,
            reasoning_effort: 'low',
            messages: [systemPrompt, ...recentMessages],
            max_tokens: 600,
            temperature: 0.85,
          })
          break
        } catch (e) {
          if (!(e instanceof OpenAI.APIError && e.status === 404)) throw e
          retired.push(model)
        }
      }
      if (retired.length) {
        await alertHenry(
          response ? 'Groq model retired, fallback in use' : 'all Groq models retired, Clappy is offline',
          `Groq returned 404 for: ${retired.join(', ')}.`,
        )
      }
      if (!response) throw new Error(`All Groq models unavailable: ${retired.join(', ')}`)

      // Chat bubbles render plain text, so strip the markdown models like to add.
      const text = (response.choices[0]?.message?.content || 'I seem to be at a loss for words.')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/^\s*[-*]\s+/gm, '• ')

      return new Response(text, {
        headers: {'Content-Type': 'text/plain; charset=utf-8'},
      })
    } catch (inferenceError: any) {
      console.error('Inference error:', inferenceError?.status, inferenceError?.message)

      if (inferenceError instanceof OpenAI.APIError && inferenceError.status === 429) {
        return new Response(
          "📎 Too many people are chatting with me at once! Give me a minute, or reach Henry on the contact page.",
          {headers: {'Content-Type': 'text/plain; charset=utf-8'}, status: 429},
        )
      }

      return new Response(OFFLINE, {headers: {'Content-Type': 'text/plain; charset=utf-8'}, status: 503})
    }
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({error: 'Internal server error'}, {status: 500})
  }
}
