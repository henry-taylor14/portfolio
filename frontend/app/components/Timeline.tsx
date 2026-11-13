'use client'

import {useRef} from 'react'
import {motion, useInView} from 'framer-motion'

type TimelineItem = {
  _key: string
  month?: string
  year?: string
  title?: string
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
  const isInView = useInView(ref, {once: true, margin: '0px 0px -80px 0px'})

  const date = [item.month, item.year].filter(Boolean).join(' ')

  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0, x: 40}}
      animate={isInView ? {opacity: 1, x: 0} : {opacity: 0, x: 40}}
      transition={{duration: 0.5, ease: 'easeOut', delay: index * 0.08}}
      className="relative pl-10 pb-10 last:pb-0"
    >
      {/* Dot on the line */}
      <span className="absolute left-0 top-1.5 -translate-x-[5px] w-3 h-3 rounded-full bg-purple-800 dark:bg-pink-500 ring-2 ring-white dark:ring-gray-900 z-10" />

      {/* Card */}
      <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-4 shadow-sm">
        {date && (
          <span className="inline-block mb-2 font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-800 text-white dark:bg-pink-500 dark:text-purple-800">
            {date}
          </span>
        )}
        {item.title && (
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{item.title}</h3>
        )}
        {item.description && (
          <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default function Timeline({block}: TimelineProps) {
  if (!block.items || block.items.length === 0) return null

  return (
    <div className="container my-12">
      <div className="max-w-2xl">
        {block.heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-10">{block.heading}</h2>
        )}

        {/* Timeline track */}
        <div className="relative border-l-2 border-purple-800 dark:border-pink-500 ml-1.5">
          {block.items.map((item, i) => (
            <TimelineEntry key={item._key} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
