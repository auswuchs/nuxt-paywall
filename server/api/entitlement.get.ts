export default defineEventHandler(async (event): Promise<Entitlement> => {
  const { deviceId } = parseOrFail(entitlementQuerySchema, getQuery(event))

  const entitlement = await findActiveEntitlement(deviceId)
  if (!entitlement) {
    throw apiError(404, ApiErrorCode.EntitlementNotFound, 'No active purchase for this device')
  }

  return entitlement
})
