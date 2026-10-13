export type ApiErrorCode =
  | 'validation_failed'
  | 'offers_unavailable'
  | 'entitlement_not_found'
  | 'internal'

export interface ApiErrorData {
  code: ApiErrorCode
  fields?: Record<string, string>
}
