import {Suspense} from 'react'
import Link from 'next/link'
import {PortableText} from '@portabletext/react'
import {AllPosts} from '@/app/components/Posts'
import SideBySideIcons from '@/app/components/SideBySideIcons'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

export default async function Page() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  return (
    <>
      <div className="relative bg-pink-500 dark:bg-purple-900">
        <div className="relative bg-[url(/images/tile-1-black.png)] bg-size-[5px]">
          <div className="bg-gradient-to-b from-purple-200 dark:from-rust w-full h-full absolute top-0"></div>
          <div className="container">
            <div className="relative mx-auto max-w-2xl pt-12 pb-20 sm:pb-28 xl:pt-16 lg:max-w-4xl lg:px-12 flex flex-col items-center justify-center">
              <div className="flex flex-col gap-6 items-center">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-gold-650 dark:text-white">
                  <div className="underline decoration-brand dark:decoration-gold-300 underline-offset-8">
                    Henry Taylor.
                  </div>
                </h1>
                <p className="text-md leading-6 uppercase py-1 px-3 bg-white text-black font-mono italic">
                  Full-stack &amp; AI engineer
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-col items-center">
          <SideBySideIcons />
          <div className="container relative mx-auto max-w-2xl pb-12 pt-6 sm:pb-16 space-y-8 lg:max-w-4xl lg:px-12 flex flex-col items-center">
            <div className="prose sm:prose-lg md:prose-xl xl:prose-2xl text-gray-700 prose-a:text-gray-700 dark:text-gray-100 dark:prose-a:text-gray-100 font-light text-center">
              {settings?.description && <PortableText value={settings.description} />}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <Link
                href="#projects"
                className="rounded-full bg-black px-6 py-3 text-white font-mono focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-800 dark:focus-visible:outline-pink-500"
              >
                See projects
              </Link>
              <Link
                href="/contact"
                className="py-3 font-mono underline decoration-brand dark:decoration-pink-500 decoration-2 underline-offset-8 hover:underline-offset-4 transition-all ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-800 dark:focus-visible:outline-pink-500"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-pink-100 dark:bg-purple-950">
        <div className="container">
          <aside id="projects" className="pt-12 pb-16 sm:pt-14 sm:pb-24 scroll-mt-24">
            <Suspense>{await AllPosts()}</Suspense>
          </aside>
        </div>
      </div>
    </>
  )
}
