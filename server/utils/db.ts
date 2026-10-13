import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../db/schema'

let instance: ReturnType<typeof createDb> | undefined

function createDb(url: string) {
  return drizzle(neon(url), { schema })
}

export function useDb() {
  if (!instance) {
    const url = process.env.DATABASE_URL
    if (!url) throw createError({ statusCode: 500, statusMessage: 'DATABASE_URL is not set' })
    instance = createDb(url)
  }
  return instance
}
