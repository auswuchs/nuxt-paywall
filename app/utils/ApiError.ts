export function getApiErrorCode(error: unknown): ApiErrorCode | undefined {
  if (typeof error !== 'object' || error === null || !('data' in error)) return undefined

  const body = error.data as { data?: Partial<ApiErrorData> } | undefined
  return body?.data?.code
}
