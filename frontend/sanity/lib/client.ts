import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId, studioUrl} from '@/sanity/lib/api'
import {token} from './token'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    studioUrl,
    filter: (props) => {
      if (props.sourcePath.at(-1) === 'title') {
        return true
      }
      return props.filterDefault(props)
    },
  },
})

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  perspective: 'previewDrafts',
})

