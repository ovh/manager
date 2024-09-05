export function getVisitorId() {
  return document.cookie?.match(/clientSideUserId=([a-z0-9]+)?/i)?.[1] || '';
}
