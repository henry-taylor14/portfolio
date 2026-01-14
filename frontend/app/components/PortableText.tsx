// frontend/app/components/PortableText.tsx

import {PortableText, type PortableTextComponents, type PortableTextBlock} from 'next-sanity'
import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'

import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneDark} from 'react-syntax-highlighter/dist/cjs/styles/prism'

import ResolvedLink from '@/app/components/ResolvedLink'

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string
  value: PortableTextBlock[]
}) {
  const components: PortableTextComponents = {

    types: {
      image: ({value}) => {
        if (!value?.asset?._ref) return null

        return (
          <figure className="my-8 mx-auto max-w-4xl px-4">
            <Image
              src={urlFor(value).width(1200).auto('format').url()}
              alt={value.alt || ''}
              width={1200}
              height={600}
              sizes="(max-width: 640px) 100vw,
                    (max-width: 1024px) 90vw,
                    800px"
              className="w-full h-auto rounded-lg mx-auto"
            />
            {value.alt && (
              <figcaption className="mt-2 text-center text-sm text-gray-500">
                {value.alt}
              </figcaption>
            )}
          </figure>
        )
      },
      code: ({value}) => (
        <div className="my-8">
          {value.filename && (
            <div className="rounded-t bg-gray-800 px-4 py-2 text-sm text-gray-200">
              {value.filename}
            </div>
          )}
          <SyntaxHighlighter
            language={value.language || 'text'}
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: value.filename ? '0 0 0.5rem 0.5rem' : '0.5rem',
            }}
          >
            {value.code}
          </SyntaxHighlighter>
        </div>
      ),
    },

    block: {
      h1: ({children, value}) => (
        // Add an anchor to the h1
        <h1 className="group relative">
          {children}
          <a
            href={`#${value?._key}`}
            className="absolute left-0 top-0 bottom-0 -ml-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </a>
        </h1>
      ),
      h2: ({children, value}) => {
        // Add an anchor to the h2
        return (
          <h2 className="group relative">
            {children}
            <a
              href={`#${value?._key}`}
              className="absolute left-0 top-0 bottom-0 -ml-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </a>
          </h2>
        )
      },
    },

    marks: {
      link: ({children, value: link}) => {
        return <ResolvedLink link={link}>{children}</ResolvedLink>
      },
    },
  }

  return (
    <div className={['prose prose-a:text-brand dark:text-gray-200', className].filter(Boolean).join(' ')}>
      <PortableText components={components} value={value} />
    </div>
  )
}
