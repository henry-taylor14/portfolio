'use client'

import {useRef} from 'react'
import {motion, useInView, useReducedMotion, useScroll, useSpring} from 'framer-motion'

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
  // Dot lights up when entry crosses viewport middle (roughly where the progress line is)
  const isActive = useInView(ref, {margin: '0px 0px -50% 0px'})
  const isInView = useInView(ref, {once: true, margin: '0px 0px -80px 0px'})

  const date = [item.month, item.year].filter(Boolean).join(' ')
  const isRight = index % 2 === 1
  const x = reduceMotion ? 0 : isRight ? 40 : -40

  return (
    <div ref={ref} className="relative pb-12 last:pb-0 md:grid md:grid-cols-2 md:gap-16">
      {/* Dot on the line */}
      <span
        className={`absolute left-4 md:left-1/2 top-5 -translate-x-1/2 w-3.5 h-3.5 rounded-full ring-4 ring-white dark:ring-gray-900 z-10 transition-colors duration-300 ${
          isActive || reduceMotion
            ? 'bg-purple-800 dark:bg-pink-500'
            : 'bg-gray-300 dark:bg-gray-600'
        }`}
      />

      <motion.div
        initial={{opacity: 0, x}}
        animate={isInView ? {opacity: 1, x: 0} : {opacity: 0, x}}
        transition={{duration: 0.5, ease: 'easeOut'}}
        className={`pl-12 md:pl-0 ${isRight ? 'md:col-start-2' : 'md:text-right'}`}
      >
        <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-4 shadow-sm">
          {date && (
            <span className="inline-block mb-2 font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-800 text-white dark:bg-pink-500 dark:text-purple-800">
              {date}
            </span>
          )}
          {item.title && (
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{item.title}</h3>
          )}
          {item.subtitle && (
            <p className="text-sm font-medium text-purple-700 dark:text-pink-300">
              {item.subtitle}
            </p>
          )}
          {item.description && (
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function Timeline({block}: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const {scrollYProgress} = useScroll({target: trackRef, offset: ['start 70%', 'end 50%']})
  const scaleY = useSpring(scrollYProgress, {stiffness: 120, damping: 30, restDelta: 0.001})

  if (!block.items || block.items.length === 0) return null

  return (
    <div className="container my-12">
      <div className="max-w-5xl mx-auto">
        {block.heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-12 md:text-center">
            {block.heading}
          </h2>
        )}

        <div ref={trackRef} className="relative">
          {/* Track + scroll-driven progress fill */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gray-200 dark:bg-gray-700" />
          <motion.div
            style={{scaleY: reduceMotion ? 1 : scaleY}}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 origin-top bg-purple-800 dark:bg-pink-500"
          />

          {block.items.map((item, i) => (
            <TimelineEntry key={item._key} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
