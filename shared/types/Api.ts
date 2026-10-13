export enum ApiErrorCode {
  ValidationFailed = 'validation_failed',
  OffersUnavailable = 'offers_unavailable',
  Internal = 'internal',
}

export interface ApiErrorData {
  code: ApiErrorCode
}

export enum SimulateMode {
  Error = 'error',
}
