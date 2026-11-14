'use client'

import {useRef} from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'

type TimelineItem = {
  _key: string
  month?: string
  year?: string
  title?: string
  subtitle?: string
  description?: string
}

type TimelineBlock = {
  heading?: string
  items?: TimelineItem[]
}

type TimelineProps = {
  block: TimelineBlock
  index: number
}

function TimelineEntry({item, index}: {item: TimelineItem; index: number}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  // Active once the entry's top crosses viewport center, where the line's tip sits
  const isActive = useInView(ref, {margin: '0px 0px -50% 0px'})
  // Card shown while it's at least 100px inside the viewport; fades back out when it leaves
  const isVisible = useInView(ref, {margin: '-100px 0px'})

  const date = [item.month, item.year].filter(Boolean).join(' ')
  const isRight = index % 2 === 1
  const active = isActive || reduceMotion

  return (
    <div ref={ref} className="relative mb-16 last:mb-0 md:grid md:grid-cols-2 md:gap-20 md:items-center">
      {/* Dot on the line, pulses once reached */}
      <motion.span
        className={`absolute left-4 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-5 h-5 rounded-full border-4 bg-white dark:bg-gray-900 transition-colors duration-300 ${
          active ? 'border-purple-800 dark:border-gold-400' : 'border-gray-300 dark:border-gray-600'
        }`}
        animate={
          active && !reduceMotion
            ? {
                scale: [1, 1.3, 1],
                boxShadow: [
                  '0 0 0px rgba(249,194,188,0)',
                  '0 0 12px rgba(249,194,188,0.6)',
                  '0 0 0px rgba(249,194,188,0)',
                ],
              }
            : {}
        }
        transition={{duration: 0.8, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut'}}
      />

      {/* ponytail: card reveal is a CSS transition toggled by class, not framer, and there is no parallax.
          Per-frame style writes on elements holding Sanity text make the visual-editing overlay
          re-parse every frame (max update depth / jank in Presentation). Keep JS-driven motion off the card. */}
      <div className={`pl-12 md:pl-0 ${isRight ? 'md:col-start-2' : ''}`}>
        <div
          className={`rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-4 shadow-sm transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none ${
            isVisible || reduceMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          {date && (
            <span className="inline-block mb-2 font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-800 text-white dark:bg-gold-400 dark:text-purple-800">
              {date}
            </span>
          )}
          {item.title && (
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{item.title}</h3>
          )}
          {item.subtitle && (
            <p className="text-sm font-medium text-purple-700 dark:text-gold-300">{item.subtitle}</p>
          )}
          {item.description && (
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Timeline({block}: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  // ponytail: 'center' offsets (Lightswind uses start/end of viewport) so line tip tracks viewport middle for a mid-page section
  const {scrollYProgress} = useScroll({target: trackRef, offset: ['start center', 'end center']})
  const progress = useSpring(scrollYProgress, {stiffness: 100, damping: 30, restDelta: 0.001})
  const height = useTransform(progress, [0, 1], ['0%', '100%'])

  if (!block.items || block.items.length === 0) return null

  return (
    <div className="container my-12 overflow-x-clip">
      <div className="max-w-5xl mx-auto">
        {block.heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-16 md:text-center">
            {block.heading}
          </h2>
        )}

        <div ref={trackRef} className="relative py-4">
          {/* Static track */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 rounded-full bg-gray-200 dark:bg-gray-700" />

          {/* Scroll-driven gradient fill */}
          <motion.div
            style={{height: reduceMotion ? '100%' : height}}
            className="absolute left-4 md:left-1/2 top-0 z-10 w-0.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-800 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(166,130,170,0.5),0_0_25px_rgba(249,194,188,0.3)] dark:from-purple-600 dark:via-gold-600 dark:to-gold-300 dark:shadow-[0_0_15px_rgba(216,170,43,0.45),0_0_25px_rgba(225,187,81,0.25)]"
          />

          {/* Glowing comet riding the line's tip */}
          {!reduceMotion && (
            <motion.div
              style={{top: height}}
              className="absolute left-4 md:left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-[radial-gradient(circle,rgba(249,194,188,0.85)_0%,rgba(166,130,170,0.5)_40%,transparent_70%)] shadow-[0_0_15px_4px_rgba(249,194,188,0.55),0_0_25px_8px_rgba(166,130,170,0.4),0_0_40px_15px_rgba(81,57,82,0.2)] dark:bg-[radial-gradient(circle,rgba(225,187,81,0.9)_0%,rgba(216,170,43,0.5)_40%,transparent_70%)] dark:shadow-[0_0_15px_4px_rgba(225,187,81,0.55),0_0_25px_8px_rgba(216,170,43,0.35),0_0_40px_15px_rgba(79,28,68,0.3)]"
                animate={{scale: [1, 1.3, 1]}}
                transition={{duration: 2, repeat: Infinity, ease: 'easeInOut'}}
              />
            </motion.div>
          )}

          <div className="relative z-20">
            {block.items.map((item, i) => (
              <TimelineEntry key={item._key} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
