import 'server-only'

export const token =
  typeof window === 'undefined'
    ? process.env.SANITY_API_READ_TOKEN
    : undefined