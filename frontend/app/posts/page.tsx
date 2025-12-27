import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {type PortableTextBlock} from 'next-sanity'
import {Suspense} from 'react'
import Avatar from '@/app/components/Avatar'
import CoverImage from '@/app/components/CoverImage'
import {AllPosts, MorePosts} from '@/app/components/Posts'
import PortableText from '@/app/components/PortableText'
import {sanityFetch} from '@/sanity/lib/live'
import {allPostsQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import SidePattern from '@/app/components/SidePattern'

type Props = {
  params: Promise<{}>
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
// export async function generateStaticParams() {
//   const {data} = await sanityFetch({
//     query: postPagesSlugs,
//     // Use the published perspective in generateStaticParams
//     perspective: 'published',
//     stega: false,
//   })
//   return data
// }

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
// export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
//   const params = await props.params
//   const {data: post} = await sanityFetch({
//     query: postQuery,
//     params,
//     // Metadata should never contain stega
//     stega: false,
//   })
//   const previousImages = (await parent).openGraph?.images || []
//   const ogImage = resolveOpenGraphImage(post?.coverImage)

//   return {
//     authors:
//       post?.author?.firstName && post?.author?.lastName
//         ? [{name: `${post.author.firstName} ${post.author.lastName}`}]
//         : [],
//     title: post?.title,
//     description: post?.excerpt,
//     openGraph: {
//       images: ogImage ? [ogImage, ...previousImages] : previousImages,
//     },
//   } satisfies Metadata
// }

export default async function PostsPage(props: Props) {
  const params = await props.params
  const [{data: Posts}] = await Promise.all([sanityFetch({query: allPostsQuery, params})])

  return (
    <div className='relative min-h-screen'>
      <SidePattern side='left'/>
      <SidePattern side='right'/>
      <div className="relative z-10 px-12 sm:px-24 lg:px-40">
        <div className="container grid gap-12">
          <div className='mt-12 lg:mt-24'>
            <div className="max-w-3xl flex flex-col gap-6">
                <Suspense>{await AllPosts()}</Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
