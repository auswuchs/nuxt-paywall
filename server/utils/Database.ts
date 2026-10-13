import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from '~~/server/db/Schema'

let instance: ReturnType<typeof createDb> | undefined

function createDb(url: string) {
  return drizzle(neon(url), { schema })
}

export function getDb() {
  if (!instance) {
    const { databaseUrl } = useRuntimeConfig()
    if (!databaseUrl) throw apiError(500, ApiErrorCode.Internal, 'NUXT_DATABASE_URL is not set')

    instance = createDb(databaseUrl)
  }
  return instance
}
