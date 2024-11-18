export function getTenantId (request) {
  const tenantIdentifier = request.channelId
  || request.headers['x-real-ip'] // nginx
  || request.headers['x-client-ip'] // apache
  || request.headers['x-forwarded-for'] // proxy
  || request.ip // fallback

  return tenantIdentifier;
}
