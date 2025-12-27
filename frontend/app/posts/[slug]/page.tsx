import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {type PortableTextBlock} from 'next-sanity'
import {Suspense} from 'react'
import Avatar from '@/app/components/Avatar'
import CoverImage from '@/app/components/CoverImage'
import {MorePosts} from '@/app/components/Posts'
import PortableText from '@/app/components/PortableText'
import {sanityFetch} from '@/sanity/lib/live'
import {postPagesSlugs, postQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import SidePattern from '@/app/components/SidePattern'

type Props = {
  params: Promise<{slug: string}>
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: postPagesSlugs,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const {data: post} = await sanityFetch({
    query: postQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(post?.coverImage)

  return {
    authors:
      post?.author?.firstName && post?.author?.lastName
        ? [{name: `${post.author.firstName} ${post.author.lastName}`}]
        : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function PostPage(props: Props) {
  const params = await props.params
  const [{data: post}] = await Promise.all([sanityFetch({query: postQuery, params})])

  if (!post?._id) {
    return notFound()
  }

  return (
    <div className='relative min-h-screen'>
      <SidePattern side='left'/>
      <SidePattern side='right'/>
      <div className="relative z-10 px-12 sm:px-24 lg:px-40">
        <div className="container mb-12 lg:mb-24 grid gap-12">
          <div className='mt-12 lg:mt-24'>
            <div className="pb-6 grid gap-6 mb-6 border-b border-gray-100">
              <div className="max-w-3xl flex flex-col gap-6">
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-7xl">
                  {post.title}
                </h2>
              </div>
              <div className="max-w-3xl flex gap-4 items-center">
                {post.author && post.author.firstName && post.author.lastName && (
                  <Avatar person={post.author} date={post.date} />
                )}
              </div>
            </div>
            <article className="gap-6 grid max-w-4xl">
              <div className="">
                {post?.coverImage && <CoverImage image={post.coverImage} priority />}
              </div>
              {post.content?.length && (
                <PortableText className="max-w-2xl text-md sm:text-lg lg:text-xl" value={post.content as PortableTextBlock[]} />
              )}
            </article>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 bg-gray-500">
        <div className="container py-12 lg:py-24 grid gap-12">
          <aside>
            <Suspense>{await MorePosts({skip: post._id, limit: 2})}</Suspense>
          </aside>
        </div>
      </div>
    </div>
  )
}
