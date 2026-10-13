import type { H3Event } from 'h3'
import type { z } from 'zod'

export function apiError(statusCode: number, code: ApiErrorCode, message: string) {
  const data: ApiErrorData = { code }

  return createError({
    statusCode,
    statusMessage: message,
    data,
  })
}

export function parseOrFail<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input)
  if (!result.success) throw apiError(400, 'validation_failed', 'Request validation failed')

  return result.data
}

export async function readBodyOrFail<T>(event: H3Event, schema: z.ZodType<T>): Promise<T> {
  let body: unknown
  try {
    body = await readBody(event)
  } catch {
    throw apiError(400, 'validation_failed', 'Malformed JSON body')
  }

  return parseOrFail(schema, body)
}
