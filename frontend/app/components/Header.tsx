'use client'

import Link from 'next/link'
import { useState } from 'react'
import HerotaText from './HerotaText'
import HerotaIcon from './HerotaIcon'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed z-50 h-24 inset-0 bg-purple-950 dark:bg-[#f9c2bc] flex items-center backdrop-blur-lg">
      <div className="container py-6 px-2 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          
          <Link className="flex items-center gap-2 m-2" href="/">
            <span className="hidden sm:block">
              <HerotaText />
            </span>
            <span className="block sm:hidden">
              <HerotaIcon size={70} className='mt-2'/>
            </span>
          </Link>

          <nav className="hidden md:block">
            <ul
              role="list"
              className="flex items-center gap-4 md:gap-6 leading-5 text-xs sm:text-base tracking-tight font-mono"
            >
              <li>
                <Link 
                  href="/about" 
                  className="hover-device:hover:underline text-white dark:text-purple-950 transition-all duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="hover-device:hover:underline text-white dark:text-purple-950 transition-all duration-200"
                >
                  Contact
                </Link>
              </li>
              <li className="sm:before:w-[1px] sm:before:bg-gray-200 before:block flex sm:gap-4 md:gap-6">
                <Link
                  className="rounded-full flex gap-4 items-center bg-black focus:bg-gray-700 py-2 px-4 justify-center sm:py-3 sm:px-6 text-white transition-colors duration-200"
                  href="/posts"
                >
                  <span className="whitespace-nowrap">Latest Posts</span>
                </Link>
              </li>
            </ul>
          </nav>

          <button
            className="md:hidden p-2 text-white dark:text-purple-950"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <ul className="flex flex-col gap-4 text-base tracking-tight font-mono">
              <li>
                <Link 
                  href="/about" 
                  className="block py-2 text-white dark:text-purple-950"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="block py-2 text-white dark:text-purple-950"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  className="rounded-full flex gap-4 items-center bg-black py-3 px-6 text-white justify-center"
                  href="/posts"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Posts</span>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}


// import Link from 'next/link'
// import HerotaText from './HerotaText'

// export default async function Header() {

//   return (
//     <header className="fixed z-50 h-24 inset-0 bg-purple-950 dark:bg-[#f9c2bc] flex items-center backdrop-blur-lg">
//       <div className="container py-6 px-2 sm:px-6">
//         <div className="flex items-center justify-between gap-5">
//           <Link className="flex items-center gap-2 m-2" href="/">
//             <HerotaText />
//           </Link>

//           <nav>
//             <ul
//               role="list"
//               className="flex items-center gap-4 md:gap-6 leading-5 text-xs sm:text-base tracking-tight font-mono"
//             >
//               <li>
//                 <Link href="/about" className="hover:underline text-white dark:text-purple-950">
//                   About
//                 </Link>
//               </li>

//               <li>
//                 <Link href="/contact" className="hover:underline text-white dark:text-purple-950">
//                   Contact
//                 </Link>
//               </li>

//               <li className="sm:before:w-[1px] sm:before:bg-gray-200 before:block flex sm:gap-4 md:gap-6">
//                 <Link
//                   className="rounded-full flex gap-4 items-center bg-black hover:bg-orange-300 focus:bg-blue py-2 px-4 justify-center sm:py-3 sm:px-6 text-white transition-colors duration-200"
//                   href=""
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <span className="whitespace-nowrap">Latest Posts</span>
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </header>
//   )
// }
