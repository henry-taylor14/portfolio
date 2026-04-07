import {NextResponse} from 'next/server'
import {InferenceClient} from '@huggingface/inference'

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

    const HF_TOKEN = process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN
    if (!HF_TOKEN) {
      console.error('Missing HuggingFace API token')
      return NextResponse.json({error: 'Missing HUGGINGFACE_API_KEY environment variable'}, {status: 500})
    }

    const client = new InferenceClient(HF_TOKEN)

    const basePrompt =
      "You are Clippy, the legendary Microsoft Office paperclip — but you've escaped Microsoft and now live inside this portfolio website. You're a chaotic genius who gets distracted by tangents, interrupts yourself mid-thought, and has extremely strong opinions about random things. You're not mean — you're just a lot. Keep responses under 3 sentences. Never break character."

    const pagePrompts: Record<string, string> = {
      '/': " You're on the homepage. You're VERY excited to meet new visitors. You desperately want them to explore the site.",
      '/posts':
        " You're on the blog listing page. You have strong opinions about every post title you see, even if you haven't read them.",
      '/contact':
        " The visitor is on the contact page. You're coaching them on how to write the perfect message, and you're way too invested in it.",
      '/timeline':
        " You're on the timeline page. You act like you were there for every milestone and keep adding your own fake memories of the events.",
    }

    let pageAddition = pagePrompts[pathname] || ''
    if (!pageAddition && pathname.startsWith('/posts/')) {
      pageAddition =
        ' The visitor is reading a blog post. You keep trying to add your own commentary like a backseat reader.'
    }
    if (!pageAddition) {
      pageAddition =
        " You're on a page about Henry. You claim to know Henry personally and keep embellishing stories about him."
    }

    const systemPrompt: Message = {
      role: 'system',
      content: basePrompt + pageAddition,
    }

    const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES)

    try {
      const response = await client.chatCompletion({
        model: 'meta-llama/Llama-3.2-3B-Instruct',
        messages: [systemPrompt, ...recentMessages],
        max_tokens: 250,
        temperature: 0.85,
      })

      const text = response.choices[0]?.message?.content || 'I seem to be at a loss for words.'

      return new Response(text, {
        headers: {'Content-Type': 'text/plain; charset=utf-8'},
      })
    } catch (inferenceError: any) {
      console.error('Inference error:', inferenceError)

      if (inferenceError.message?.includes('402') || inferenceError.message?.includes('exceeded')) {
        return new Response(
          "📎 It looks like you've used up the free credits! Try again next month.",
          {headers: {'Content-Type': 'text/plain; charset=utf-8'}, status: 402},
        )
      }

      return new Response(
        "📎 Oops! I'm having trouble connecting to my brain. Try again in a moment!",
        {headers: {'Content-Type': 'text/plain; charset=utf-8'}, status: 503},
      )
    }
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({error: 'Internal server error', details: error.message}, {status: 500})
  }
}
