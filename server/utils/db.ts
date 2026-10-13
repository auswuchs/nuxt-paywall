import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../db/schema'

let instance: ReturnType<typeof createDb> | undefined

function createDb(url: string) {
  return drizzle(neon(url), { schema })
}

export function useDb() {
  if (!instance) {
    const { databaseUrl } = useRuntimeConfig()
    if (!databaseUrl) throw createError({ statusCode: 500, statusMessage: 'NUXT_DATABASE_URL is not set' })
    instance = createDb(databaseUrl)
  }
  return instance
}
