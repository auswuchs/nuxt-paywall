export default defineEventHandler(async (event): Promise<EntitlementResponse> => {
  const { deviceId } = parseOrFail(entitlementQuerySchema, getQuery(event))

  return { entitlement: await findActiveEntitlement(deviceId) ?? null }
})
