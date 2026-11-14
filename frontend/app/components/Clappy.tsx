'use client'

import {useState, useRef, useEffect} from 'react'
import {usePathname} from 'next/navigation'
import Link from 'next/link'
import {AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring} from 'framer-motion'
import ClappyFigure, {type ClappyMood} from './ClappyFigure'
import {scriptedReply} from './clappy-script'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

// cloud: Groq via /api/clappy. offline: Groq failed, visitor chooses. backup: scripted Clappy (clappy-script.ts).
type Brain = 'cloud' | 'offline' | 'backup'

export type ClappyVariant = 'home' | 'blog' | 'post' | 'contact' | 'timeline' | 'about'

function getVariant(pathname: string): ClappyVariant {
  if (pathname === '/') return 'home'
  if (pathname === '/posts') return 'blog'
  if (pathname.startsWith('/posts/')) return 'post'
  if (pathname === '/contact') return 'contact'
  if (pathname === '/timeline') return 'timeline'
  return 'about'
}


// One teaser line and two starter questions per page. Questions are ones Clappy can answer from real facts.
const PAGE_COPY: Record<ClappyVariant, {teaser: string; prompts: [string, string]}> = {
  home: {teaser: 'Hiring? I know where Henry keeps the good stuff.', prompts: ['What has Henry built?', 'How do I hire Henry?']},
  blog: {teaser: 'Want a tour? Ask me which project fits.', prompts: ['Which project shows automation?', "What's Henry's stack?"]},
  post: {teaser: 'Questions about this one? I read it. Twice.', prompts: ['What problem did this solve?', 'What does this show about Henry?']},
  contact: {teaser: "Writer's block? I can help you draft this.", prompts: ['Help me write a hiring message', 'What should I include?']},
  timeline: {teaser: 'I was there for all of it. Allegedly.', prompts: ['Who is Henry?', 'What does Henry work on?']},
  about: {teaser: "I've known Henry for years. Mostly as a paperclip.", prompts: ['Who is Henry?', 'What does Henry work on?']},
}

// sessionStorage can throw (private mode, blocked storage); the teaser just shows again in that case.
function seen(key: string) {
  try {
    return sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}
function markSeen(key: string) {
  try {
    sessionStorage.setItem(key, '1')
  } catch {}
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          <motion.div
            className="w-2 h-2 rounded-full bg-gray-400"
            animate={{y: [0, -4, 0]}}
            transition={{duration: 0.6, repeat: Infinity, delay: 0}}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-gray-400"
            animate={{y: [0, -4, 0]}}
            transition={{duration: 0.6, repeat: Infinity, delay: 0.15}}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-gray-400"
            animate={{y: [0, -4, 0]}}
            transition={{duration: 0.6, repeat: Infinity, delay: 0.3}}
          />
        </div>
      </div>
    </div>
  )
}

export default function Clappy() {
  const pathname = usePathname()
  const variant = getVariant(pathname)
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const [brain, setBrain] = useState<Brain>('cloud')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [teaser, setTeaser] = useState(false)
  const reduceMotion = useReducedMotion()
  const [blink, setBlink] = useState(false)
  const [gesture, setGesture] = useState<ClappyMood | null>(null)
  const gestureTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const rawPupilX = useMotionValue(0)
  const rawPupilY = useMotionValue(0)
  const pupilX = useSpring(rawPupilX, {stiffness: 300, damping: 30})
  const pupilY = useSpring(rawPupilY, {stiffness: 300, damping: 30})
  const mood: ClappyMood = collapsed ? 'idle' : loading ? 'thinking' : (gesture ?? 'idle')

  function flash(next: ClappyMood) {
    setGesture(next)
    clearTimeout(gestureTimer.current)
    gestureTimer.current = setTimeout(() => setGesture(null), 2400)
  }
  useEffect(() => () => clearTimeout(gestureTimer.current), [])

  // Blink at random intervals; skipped while the tab is hidden or motion is reduced.
  useEffect(() => {
    if (reduceMotion) return
    let t: ReturnType<typeof setTimeout>
    const schedule = () => {
      t = setTimeout(() => {
        if (!document.hidden) {
          setBlink(true)
          setTimeout(() => setBlink(false), 140)
        }
        schedule()
      }, 3000 + Math.random() * 4000)
    }
    schedule()
    return () => clearTimeout(t)
  }, [reduceMotion])

  // Eyes follow the cursor on mouse/trackpad devices.
  useEffect(() => {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const box = toggleRef.current?.getBoundingClientRect()
        if (!box) return
        const dx = e.clientX - (box.left + box.width / 2)
        const dy = e.clientY - (box.top + box.height * 0.4)
        const dist = Math.hypot(dx, dy) || 1
        const pull = Math.min(1, dist / 400)
        rawPupilX.set((dx / dist) * 40 * pull)
        rawPupilY.set((dy / dist) * 22 * pull)
      })
    }
    window.addEventListener('pointermove', onMove, {passive: true})
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reduceMotion, rawPupilX, rawPupilY])

  // Idle gestures every 18–32s while Clappy is standing and the chat is closed.
  useEffect(() => {
    if (reduceMotion || open || collapsed) return
    let t: ReturnType<typeof setTimeout>
    const schedule = () => {
      t = setTimeout(() => {
        if (!document.hidden) flash(Math.random() < 0.5 ? 'idea' : 'look')
        schedule()
      }, 18000 + Math.random() * 14000)
    }
    schedule()
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, open, collapsed])
  const copy = PAGE_COPY[variant]

  // Teaser: once per page per session, after 4s or once the visitor scrolls past the first screen.
  useEffect(() => {
    setTeaser(false)
    const key = `clappy-teased:${pathname}`
    if (open || seen('clappy-opened') || seen(key)) return
    let shown = false
    let hideTimer: ReturnType<typeof setTimeout>
    const show = () => {
      if (shown) return
      shown = true
      markSeen(key)
      setTeaser(true)
      flash('idea')
      hideTimer = setTimeout(() => setTeaser(false), 9000)
    }
    const timer = setTimeout(show, 4000)
    const onScroll = () => window.scrollY > window.innerHeight * 0.6 && show()
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
      window.removeEventListener('scroll', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  function openChat() {
    setTeaser(false)
    setCollapsed(false)
    setOpen(true)
    markSeen('clappy-opened')
  }

  function handleClose() {
    setCollapsed(true)
    setOpen(false)
    toggleRef.current?.focus()
  }

  useEffect(() => () => abortRef.current?.abort(), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      // Esc inside the download warning closes only the warning (native <dialog> handles it).
      if (e.key === 'Escape' && !dialogRef.current?.open) handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({behavior: 'smooth'})
    }
  }, [messages, loading, open])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open])

  function startBackupBrain() {
    dialogRef.current?.close()
    setBrain('backup')
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: "📎 Backup Clappy reporting for duty! Ask me who Henry is, what he's built, or how to hire him.",
      },
    ])
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  async function sendMessage(override?: string) {
    const trimmed = (override ?? input).trim()
    if (!trimmed || loading) return

    const userMessage: Message = {role: 'user', content: trimmed}
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    if (brain === 'backup') {
      setMessages((prev) => [...prev, {role: 'assistant', content: scriptedReply(trimmed, prev.length)}])
      setLoading(false)
      flash('idea')
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/clappy', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({messages: updatedMessages, pathname}),
        signal: controller.signal,
      })

      if (!res.ok) {
        // Plain-text errors are written for visitors; JSON errors are internal and get a friendly fallback.
        const isText = res.headers.get('content-type')?.startsWith('text/plain')
        const errorText = isText ? await res.text().catch(() => '') : ''
        if (res.status === 503) setBrain('offline')
        setMessages((prev) => [
          ...prev,
          {role: 'assistant', content: errorText || "📎 Something went sideways on my end. Try sending that again."},
        ])
        return
      }

      if (!res.body) {
        setMessages((prev) => [...prev, {role: 'assistant', content: 'No response. Try again!'}])
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      setMessages((prev) => [...prev, {role: 'assistant', content: ''}])

      while (true) {
        const {value, done} = await reader.read()
        if (done) break
        assistantContent += decoder.decode(value, {stream: true})
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {role: 'assistant', content: assistantContent}
          return updated
        })
      }
      flash('idea')
    } catch (error) {
      if (controller.signal.aborted) return
      setBrain('offline')
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "📎 I couldn't reach my brain. Check your connection and try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{opacity: 0, y: 20, scale: 0.95}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 20, scale: 0.95}}
            transition={{duration: 0.2, ease: 'easeOut'}}
            id="clappy-panel"
            role="dialog"
            aria-label="Chat with Clappy"
            className="mb-3 w-[calc(100vw-1rem)] sm:w-96 max-h-[65vh] sm:max-h-[70vh] rounded-2xl shadow-2xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-700 flex flex-col relative"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              aria-label="Close chat"
              className="absolute -top-3 -right-3 w-7 h-7 rounded-full after:absolute after:-inset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-800 dark:focus-visible:outline-pink-300 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>

            <div className="flex flex-col flex-1 min-h-0 overflow-hidden rounded-2xl">
              {/* Empty state */}
              {messages.length === 0 && (
                <div className="flex flex-col bg-purple-200 dark:bg-pink-300 items-center justify-center py-6 px-4">
                  <p className="text-xs text-purple-900 font-mono text-center">
                    It looks like you&apos;re browsing this website.
                    <br />I suppose I could help you...
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {copy.prompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendMessage(prompt)}
                        className="rounded-full border border-purple-800/30 bg-white/70 px-3 py-1.5 text-xs text-purple-900 transition-colors hover:border-purple-800 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-800"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.length > 0 && (
                <div role="log" aria-live="polite" aria-busy={loading} className="flex-1 overflow-y-auto px-4 py-3 space-y-1 min-h-0">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex items-end gap-2 mb-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap [overflow-wrap:anywhere] ${
                          msg.role === 'user'
                            ? 'bg-purple-800 dark:bg-pink-500 text-white dark:text-purple-800 rounded-br-sm'
                            : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {loading && <TypingIndicator />}
                  <div ref={bottomRef} />
                </div>
              )}

              {/* Groq is down: offer the in-browser fallback or the contact page */}
              {brain === 'offline' && (
                <div className="border-t border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950 px-4 py-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => dialogRef.current?.showModal()}
                    className="w-full rounded-full bg-purple-800 px-4 py-2.5 text-sm font-mono text-white hover:bg-purple-700 dark:bg-pink-200 dark:text-purple-900 dark:hover:bg-pink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-800 dark:focus-visible:outline-pink-300"
                  >
                    🍪 Run Clappy with Cookies
                  </button>
                  <p className="text-xs text-center text-gray-700 dark:text-gray-200">
                    Switches to a simpler backup Clappy. Nothing to download.
                  </p>
                  <Link
                    href="/contact"
                    className="block text-center text-sm font-mono underline decoration-brand dark:decoration-pink-300 underline-offset-4 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-800 dark:focus-visible:outline-pink-300"
                  >
                    Contact Henry instead
                  </Link>
                </div>
              )}

              {/* Input area */}
              <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    aria-label="Message Clappy"
                    maxLength={500}
                    disabled={loading}
                    className="flex-1 text-base sm:text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full px-4 py-2 outline-none focus-visible:border-purple-600 focus-visible:ring-2 focus-visible:ring-purple-300 dark:focus-visible:border-pink-300 dark:focus-visible:ring-pink-300/40 transition-colors placeholder-gray-600 dark:placeholder-gray-300 disabled:opacity-50"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                    className="w-11 h-11 flex-shrink-0 rounded-full bg-purple-800 dark:bg-pink-200 text-white dark:text-purple-800 flex items-center justify-center hover:opacity-80 disabled:opacity-40 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-800 dark:focus-visible:outline-pink-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teaser bubble: page-specific nudge, never blocks anything */}
      <AnimatePresence>
        {teaser && !open && (
          <motion.div
            key="teaser"
            initial={reduceMotion ? {opacity: 0} : {opacity: 0, y: 8, scale: 0.9}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, transition: {duration: 0.15}}}
            transition={{type: 'spring', stiffness: 420, damping: 26}}
            style={{transformOrigin: 'bottom right'}}
            className="relative mb-2 mr-4 max-w-[15rem] sm:mr-8"
          >
            <button
              type="button"
              onClick={openChat}
              className="block rounded-2xl rounded-br-sm bg-purple-200 px-4 py-3 pr-8 text-left font-mono text-xs leading-5 text-purple-900 shadow-lg shadow-purple-950/15 dark:bg-pink-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-800"
            >
              {copy.teaser}
            </button>
            <button
              type="button"
              onClick={() => setTeaser(false)}
              aria-label="Dismiss Clappy's tip"
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-purple-900/70 hover:bg-purple-900/10 hover:text-purple-900 after:absolute after:-inset-2 focus-visible:outline-2 focus-visible:outline-purple-800"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        ref={toggleRef}
        onClick={() => {
          if (open) handleClose()
          else openChat()
        }}
        animate={teaser && !reduceMotion ? {rotate: [0, -10, 8, -4, 0]} : {rotate: 0}}
        transition={{duration: 0.7, ease: 'easeOut'}}
        whileHover={collapsed ? undefined : {scale: 1.08}}
        whileTap={collapsed ? undefined : {scale: 0.95}}
        aria-label={open ? 'Hide Clappy chat' : 'Chat with Clappy'}
        aria-expanded={open}
        aria-controls="clappy-panel"
        className="w-16 h-16 sm:w-20 sm:h-20 md:w-30 md:h-30 lg:w-36 lg:h-36 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-800 dark:focus-visible:outline-pink-300"
      >
        <ClappyFigure fallen={collapsed} mood={mood} blink={blink} pupilX={pupilX} pupilY={pupilY} reduceMotion={!!reduceMotion} />
      </motion.button>

      {/* Second approval before any download starts */}
      <dialog
        ref={dialogRef}
        aria-labelledby="clappy-cookies-title"
        className="m-auto max-w-sm rounded-2xl border border-purple-200 bg-white p-6 text-black shadow-2xl backdrop:bg-purple-950/60 dark:border-purple-800 dark:bg-purple-900 dark:text-white"
      >
        <h2 id="clappy-cookies-title" className="text-lg font-bold">
          Before Clappy moves in
        </h2>
        <div className="mt-3 space-y-2 text-sm leading-6 text-gray-700 dark:text-gray-200">
          <p>Clappy&apos;s usual AI brain is offline right now.</p>
          <p>
            Backup Clappy is scripted: it can tell you who Henry is, what he builds, and how to reach
            him, but it can&apos;t hold a real conversation.
          </p>
          <p>No cookies are actually involved.</p>
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-full px-4 py-2 text-sm font-mono underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-800 dark:focus-visible:outline-pink-300"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={startBackupBrain}
            className="rounded-full bg-purple-800 px-4 py-2 text-sm font-mono text-white hover:bg-purple-700 dark:bg-pink-200 dark:text-purple-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-800 dark:focus-visible:outline-pink-300"
          >
            Run backup Clappy
          </button>
        </div>
      </dialog>
    </div>
  )
}
