'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import HerotaText from './HerotaText'
import HerotaIcon from './HerotaIcon'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Lock scroll when menu open (recommended)
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-24 bg-purple-800 dark:bg-pink-600 backdrop-blur-lg flex items-center">
        <div className="container py-6 px-2 sm:px-6">
          <div className="flex items-center justify-between gap-5">
            <Link className="flex items-center gap-2 m-2" href="/">
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
                    Latest Posts
                  </Link>
                </li>
              </ul>
            </nav>

            {!mobileMenuOpen && (
              <button
                className="md:hidden p-2 text-white"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
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
        className={`bg-black/95 backdrop-blur-sm ease-[cubic-bezier(.4,0,.2,1)] motion-reduce:transition-none
          fixed inset-0 z-[60] md:hidden bg-black text-white
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}
        `}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <HerotaIcon size={56} />
          </Link>

          <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="p-2">
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
                Latest Posts
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
