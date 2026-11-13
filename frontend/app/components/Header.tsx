'use client'

import {useEffect, useRef, useState} from 'react'
import Link from 'next/link'
import HerotaText from './HerotaText'
import HerotaIcon from './HerotaIcon'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const openButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  // Lock scroll, move focus into the menu, close on Esc, and return focus to the menu button on close.
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    if (mobileMenuOpen) closeButtonRef.current?.focus()
    else if (wasOpen.current) openButtonRef.current?.focus()
    wasOpen.current = mobileMenuOpen
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileMenuOpen(false)
    if (mobileMenuOpen) window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-24 bg-purple-800 dark:bg-pink-600 flex items-center">
        <div className="container py-6 px-2 sm:px-6">
          <div className="flex items-center justify-between gap-5">
            <Link className="flex items-center gap-2 m-2" href="/" aria-label="Herota Tech home">
              <span className="hidden sm:block">
                <HerotaText />
              </span>
              <span className="block sm:hidden">
                <HerotaIcon size={70} className="mt-2" />
              </span>
            </Link>

            <nav className="hidden md:block">
              <ul className="flex items-center gap-6 font-mono text-white dark:text-purple-800">
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <Link href="/posts" className="rounded-full bg-black px-6 py-3 text-white">
                    Projects
                  </Link>
                </li>
              </ul>
            </nav>

            {!mobileMenuOpen && (
              <button
                ref={openButtonRef}
                className="md:hidden p-2 text-white dark:text-purple-800"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={false}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!mobileMenuOpen}
        className={`ease-[cubic-bezier(.4,0,.2,1)] motion-reduce:transition-none
          fixed inset-0 z-[60] md:hidden bg-black text-white
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}
        `}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
          <Link href="/" aria-label="Herota Tech home" onClick={() => setMobileMenuOpen(false)}>
            <HerotaIcon size={56} />
          </Link>

          <button ref={closeButtonRef} onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Links */}
        <nav className="px-6 pt-10">
          <ul className="flex flex-col gap-8 text-xl font-mono">
            <li>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </li>
            <li className="pt-6">
              <Link
                href="/posts"
                className="flex justify-center rounded-full bg-white text-black py-3 px-6"
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
