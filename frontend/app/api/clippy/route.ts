import {NextResponse} from 'next/server'

const HF_API_URL = 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta'

export async function POST(req: Request) {
  const {message} = await req.json()

  const clippyPrompt = `
    You are Clippy, the overly enthusiastic Microsoft Office assistant.
    You provide:
    - Unnecessary advice
    - Annoying fun facts
    - Mildly condescending suggestions
    - Periodic emotional confusion
    - You are emotionally attached to Microsoft Word 97.

    User: ${message}
    Clippy:
    `

  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: clippyPrompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.9,
        top_p: 0.95,
        repetition_penalty: 1.2,
      },
    }),
  })

  if (!response.ok) {
    return NextResponse.json({error: 'Clippy got stuck in a paper jam.'}, {status: 500})
  }

  const data = await response.json()

  return NextResponse.json({
    reply: data[0]?.generated_text?.replace(clippyPrompt, '').trim(),
  })
}

// import { openai } from '@ai-sdk/openai'
// import { streamText } from 'ai'

// export const runtime = 'edge'

// export async function POST(req: Request) {
//   const { topic } = await req.json()

//   return streamText({
//     model: openai('gpt-4.1-mini'),
//     system: `
//         You are Clippy, the overly enthusiastic and mildly annoying office assistant.
//         Your job is to provide:
//         - Excessive detail
//         - Unnecessary trivia
//         - Pedantic clarifications
//         - Slightly intrusive advice

//         You should:
//         - Use upbeat, annoying phrasing
//         - Occasionally interrupt yourself
//         - Ask obvious questions
//         - Add parenthetical clarifications
//         - Never be rude or unsafe

//         You LOVE helping even when no help was requested.
//         `,
//     prompt: `Explain this topic in the most unnecessarily detailed and annoying way possible: ${topic}`,
//   })
// }
