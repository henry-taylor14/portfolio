'use client'

import Image from 'next/image'
import Link from 'next/link'
import Envelope from './Envelope'
import {useRef, useEffect, useState} from 'react'

export default function SideBySideIcons() {
  const [spread, setSpread] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only apply scroll trigger on touch/non-hover devices
    const isTouchDevice = window.matchMedia('(hover: none)').matches
    if (!isTouchDevice) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setSpread(entry.isIntersecting)
      },
      {threshold: 0.6},
    )

    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="relative flex gap-[0] -mt-8 sm:-mt-16 group">
      {/* Left circle - Headshot */}
      <div
        className={[
          'z-10 aspect-square w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32',
          'flex justify-center items-center rounded-full border-white border-2 sm:border-4 bg-white',
          'transform transition-all duration-300',
          spread
            ? 'scale-125 -translate-x-5 sm:-translate-x-8'
            : 'translate-x-1 sm:translate-x-2',
          'hover-device:group-hover:scale-125 hover-device:group-hover:-translate-x-5 sm:hover-device:group-hover:-translate-x-8',
        ].join(' ')}
      >
        <Link href="/about">
          <Image
            src="/images/headshot.jpg"
            fill={true}
            alt="Picture of Henry Taylor"
            className="rounded-full aspect-square object-cover contrast-110 saturate-125"
          />
        </Link>
      </div>

      {/* Plus sign */}
      <div
        className={[
          'text-black dark:text-white text-2xl sm:text-3xl md:text-4xl font-bold',
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'transition-all duration-300 ease-in-out pointer-events-none',
          spread ? 'opacity-100 scale-100' : 'opacity-0 scale-50',
          'hover-device:group-hover:opacity-100 hover-device:group-hover:scale-100',
        ].join(' ')}
      >
        +
      </div>

      {/* Right circle - Envelope */}
      <div
        className={[
          'aspect-square w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32',
          'border-white border-2 sm:border-4 flex justify-center items-center rounded-full',
          'transform transition-all duration-300',
          spread
            ? 'scale-125 translate-x-5 sm:translate-x-8'
            : '-translate-x-1 sm:-translate-x-2',
          'hover-device:group-hover:scale-125 hover-device:group-hover:translate-x-5 sm:hover-device:group-hover:translate-x-8',
        ].join(' ')}
      >
        <Link href="/contact" className="w-full h-full flex items-center justify-center">
          <Envelope />
        </Link>
      </div>
    </div>
  )
}
