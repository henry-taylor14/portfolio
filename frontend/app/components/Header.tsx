'use client'

import { useEffect, useState } from 'react'
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
      <header className="fixed top-0 left-0 right-0 z-50 h-24 bg-purple-950 dark:bg-[#f9c2bc] backdrop-blur-lg flex items-center">
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
              <ul className="flex items-center gap-6 font-mono text-white dark:text-purple-950">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li>
                  <Link
                    href="/posts"
                    className="rounded-full bg-black px-6 py-3 text-white"
                  >
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
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

          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="p-2"
          >
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






// 'use client'
// import { useEffect } from 'react'
// import Link from 'next/link'
// import { useState } from 'react'
// import HerotaText from './HerotaText'
// import HerotaIcon from './HerotaIcon'

// export default function Header() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

//   // useEffect(() => {
//   //   document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
//   //   return () => {
//   //     document.body.style.overflow = ''
//   //   }
//   // }, [mobileMenuOpen])


//   return (
//     <header className="fixed z-50 h-24 inset-0 bg-purple-950 dark:bg-[#f9c2bc] flex items-center backdrop-blur-lg">
//       <div className="container py-6 px-2 sm:px-6">
//         <div className="flex items-center justify-between gap-5">
          
//           <Link className="flex items-center gap-2 m-2" href="/">
//             <span className="hidden sm:block">
//               <HerotaText />
//             </span>
//             <span className="block sm:hidden">
//               <HerotaIcon size={70} className='mt-2'/>
//             </span>
//           </Link>

//           <nav className="hidden md:block">
//             <ul
//               role="list"
//               className="flex items-center gap-4 md:gap-6 leading-5 text-xs sm:text-base tracking-tight font-mono"
//             >
//               <li>
//                 <Link 
//                   href="/about" 
//                   className="hover-device:hover:underline text-white dark:text-purple-950 transition-all duration-200"
//                 >
//                   About
//                 </Link>
//               </li>
//               <li>
//                 <Link 
//                   href="/contact" 
//                   className="hover-device:hover:underline text-white dark:text-purple-950 transition-all duration-200"
//                 >
//                   Contact
//                 </Link>
//               </li>
//               <li className="sm:before:w-[1px] sm:before:bg-gray-200 before:block flex sm:gap-4 md:gap-6">
//                 <Link
//                   className="rounded-full flex gap-4 items-center bg-black focus:bg-gray-700 py-2 px-4 justify-center sm:py-3 sm:px-6 text-white transition-colors duration-200"
//                   href="/posts"
//                 >
//                   <span className="whitespace-nowrap">Latest Posts</span>
//                 </Link>
//               </li>
//             </ul>
//           </nav>

//           <button
//             className="md:hidden p-2 text-white relative z-50"
//             onClick={() => setMobileMenuOpen(true)}
//             aria-label="Open menu"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="w-6 h-6"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
//             </svg>
//           </button>
//         </div>

//         {mobileMenuOpen && (
//           <div className="fixed inset-0 z-40 md:hidden bg-black transition-transform duration-300">
            
//             {/* Menu Header */}
//             <div className="flex items-center justify-between px-4 py-6 border-b border-white">
//               <Link
//                 href="/"
//                 className="flex items-center gap-2"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 <HerotaIcon size={70} />
//               </Link>

//               <button
//                 onClick={() => setMobileMenuOpen(false)}
//                 aria-label="Close menu"
//                 className="p-2 text-white"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="currentColor"
//                   className="w-6 h-6"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Menu Links */}
//             <nav className="px-6 pt-8">
//               <ul className="flex flex-col gap-6 text-lg font-mono text-white">
//                 <li>
//                   <Link
//                     href="/about"
//                     className="block"
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     About
//                   </Link>
//                 </li>

//                 <li>
//                   <Link
//                     href="/contact"
//                     className="block"
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     Contact
//                   </Link>
//                 </li>

//                 <li className="pt-4">
//                   <Link
//                     href="/posts"
//                     className="flex items-center justify-center rounded-full bg-white text-black py-3 px-6"
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     Latest Posts
//                   </Link>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         )}

//       </div>
//     </header>
//   )
// }