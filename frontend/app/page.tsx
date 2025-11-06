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
      <div className="relative">
        <div className="relative bg-[url(/images/tile-1-black.png)] bg-size-[5px]">
          <div className="bg-gradient-to-b from-white dark:bg-gradient-to-b dark:from-black w-full h-full absolute top-0"></div>
          <div className="container">
            <div className="relative min-h-[40vh] mx-auto max-w-2xl pt-10 xl:pt-20 pb-30 space-y-6 lg:max-w-4xl lg:px-12 flex flex-col items-center justify-center">
              <div className="flex flex-col gap-4 items-center">
                <div className="text-md leading-6 prose uppercase py-1 px-3 bg-white font-mono italic">
                  A showcase for
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-black dark:text-gray-200">
                  <div
                    className="underline decoration-brand dark:decoration-pink-500 hover:text-[#6b4b6d] dark:hover:text-[#f9c2bc] underline-offset-8 hover:underline-offset-4 transition-all ease-out"
                  >
                    Henry Taylor.
                  </div>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-col items-center">
          <SideBySideIcons />
          <div className="container relative mx-auto max-w-2xl pb-20 pt-10 space-y-6 lg:max-w-4xl lg:px-12 flex flex-col items-center">
            <div className="prose sm:prose-lg md:prose-xl xl:prose-2xl text-gray-700 prose-a:text-gray-700 dark:text-gray-100 dark:prose-a:text-gray-100 font-light text-center">
              {settings?.description && <PortableText value={settings.description} />}
              <div className="flex items-center flex-col gap-4">
                placeholder text
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container">
          <aside className="py-12 sm:py-20">
            <Suspense>{await AllPosts()}</Suspense>
          </aside>
        </div>
      </div>
    </>
  )
}
