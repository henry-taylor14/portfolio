// Clappy's backup brain for when Groq is down: fixed, true answers only.
// ponytail: keyword routing, not NLP. Upgrade path: more intents here, never a tiny LLM (it invents facts about Henry).

const INTENTS: {match: RegExp; reply: string}[] = [
  {
    match: /\b(hire|hiring|job|role|position|contact|email|reach|available|freelance|consult|work with)\b/i,
    reply:
      "📎 Best move: the Contact page. Tell Henry what you're working on and he'll get back to you.",
  },
  {
    match: /\b(project|projects|built|build|builds|portfolio|python|n8n|automat\w*|app|apps|ai|skills?|stack)\b/i,
    reply:
      '📎 Henry builds web apps, AI features, and automations with Python and n8n. The Projects page has the full write-ups.',
  },
  {
    match: /\b(who|about|henry|he|him)\b/i,
    reply:
      '📎 Henry Taylor is a full-stack and AI engineer. He builds web apps, AI features, and automations that remove manual work.',
  },
  {
    match: /\b(hi|hello|hey|yo|sup|howdy)\b/i,
    reply:
      "📎 Hi! My big brain is napping, so you've got backup Clappy. Ask me who Henry is, what he's built, or how to hire him.",
  },
]

const FALLBACKS = [
  "📎 Backup brain only knows three things: who Henry is, what he builds, and how to reach him. Try one of those!",
  "📎 That's above my paygrade while my big brain naps. Ask about Henry's projects or how to contact him.",
  '📎 I bent myself into a question mark over that one. Try asking what Henry has built.',
]

export function scriptedReply(text: string, turn: number): string {
  for (const intent of INTENTS) {
    if (intent.match.test(text)) return intent.reply
  }
  return FALLBACKS[turn % FALLBACKS.length]
}
