import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/live'
import {morePostsQuery, allPostsQuery} from '@/sanity/lib/queries'
import {Post as PostType, AllPostsQueryResult} from '@/sanity.types'
import DateComponent from '@/app/components/Date'
import OnBoarding from '@/app/components/Onboarding'
import CoverImage from '@/app/components/CoverImage'
import {createDataAttribute} from 'next-sanity'

const Post = ({post, featured = false}: {post: AllPostsQueryResult[number]; featured?: boolean}) => {
  const {_id, title, slug, excerpt, date, stack, coverImage} = post

  const attr = createDataAttribute({
    id: _id,
    type: 'post',
    path: 'title',
  })

  return (
    <article
      data-sanity={attr()}
      key={_id}
      className={`group relative flex flex-col overflow-hidden rounded-sm ${featured ? '@3xl:col-span-2 @3xl:flex-row' : ''} border border-pink-200 bg-white dark:border-purple-800 dark:bg-purple-900 transition-colors hover:border-purple-300 dark:hover:border-purple-600 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-purple-800 dark:has-[a:focus-visible]:outline-pink-500`}
    >
      {coverImage?.asset?._ref && (
        <div
          className={`relative aspect-[16/10] overflow-hidden border-b border-pink-200 dark:border-purple-800 [&>div]:absolute [&>div]:inset-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-out group-hover:[&_img]:scale-[1.02] ${featured ? '@3xl:w-1/2 @3xl:shrink-0 @3xl:self-start @3xl:border-b-0 @3xl:border-r @3xl:border-pink-200 dark:@3xl:border-purple-800' : ''}`}
        >
          <CoverImage image={coverImage} />
        </div>
      )}
      <div className={`flex flex-1 flex-col p-6 ${featured ? '@3xl:justify-center @3xl:p-10' : ''}`}>
        <h3 className={`font-bold leading-tight text-balance ${featured ? 'text-2xl @3xl:text-4xl @3xl:tracking-tight' : 'text-2xl'}`}>
          <Link href={`/posts/${slug}`} className="outline-none after:absolute after:inset-0 after:z-10">
            {title}
          </Link>
        </h3>
        {excerpt && (
          <p className="mt-2 line-clamp-3 max-w-[65ch] text-base leading-7 text-gray-600 dark:text-gray-100">
            {excerpt}
          </p>
        )}
        <div className={`mt-auto flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pt-8 ${featured ? '@3xl:mt-0' : ''}`}>
          {stack && stack.length > 0 ? (
            <ul className="flex flex-wrap gap-2 font-mono text-xs" aria-label="Stack">
              {stack.map((tool) => (
                <li key={tool} className="bg-pink-100 px-2 py-1 text-purple-900 dark:bg-purple-800 dark:text-gold-100">
                  {tool}
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}
          <time className="font-mono text-xs text-gray-600 dark:text-gray-200" dateTime={date}>
            <DateComponent dateString={date} />
          </time>
        </div>
      </div>
    </article>
  )
}

const Posts = ({
  children,
  heading,
  subHeading,
  pageTitle = false,
}: {
  children: React.ReactNode
  heading?: string
  subHeading?: string
  pageTitle?: boolean
}) => (
  <div>
    {heading &&
      (pageTitle ? (
        <h1 className="text-4xl font-bold tracking-tight text-balance text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-7xl">{heading}</h1>
      ) : (
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-200 sm:text-4xl lg:text-5xl">
          {heading}
        </h2>
      ))}
    {subHeading && <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">{subHeading}</p>}
    <div className="@container mt-8">
      <div className="grid gap-6 @3xl:grid-cols-2">{children}</div>
    </div>
  </div>
)

export const MorePosts = async ({skip, limit}: {skip: string; limit: number}) => {
  const {data} = await sanityFetch({
    query: morePostsQuery,
    params: {skip, limit},
  })

  if (!data || data.length === 0) {
    return null
  }

  return (
    <Posts heading="More projects">
      {data?.map((post: any) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  )
}

export const AllPosts = async ({pageTitle = false}: {pageTitle?: boolean} = {}) => {
  const {data} = await sanityFetch({query: allPostsQuery})

  if (!data || data.length === 0) {
    return <OnBoarding />
  }

  return (
    <Posts
      heading="Projects"
      subHeading="What I've built lately."
      pageTitle={pageTitle}
    >
      {data.map((post: any, i: number) => (
        <Post key={post._id} post={post} featured={i === 0} />
      ))}
    </Posts>
  )
}
