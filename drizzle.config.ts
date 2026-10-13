import 'dotenv/config'

import { defineConfig } from 'drizzle-kit'

const url = process.env.NUXT_DATABASE_URL

// drizzle-kit на кривой строке подключения падает молча — лучше упасть с понятной ошибкой.
if (!url?.startsWith('postgres')) {
  throw new Error('NUXT_DATABASE_URL должен быть строкой postgresql://… без кавычек')
}

export default defineConfig({
  schema: './server/db/Schema.ts',
  out: './server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url },
})
