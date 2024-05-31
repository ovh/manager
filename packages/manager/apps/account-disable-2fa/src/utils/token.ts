export function extractToken(): string | null {
  const url: URL = new URL(window.location.href);
  const { searchParams } = url;
  return searchParams.get('token');
}

export function decodeToken(token = '') {
  if (!token) {
    return null;
  }

  const rawPayloadBase64 = token.split('.')[1];
  const payloadFormattedBase64 = rawPayloadBase64.replace(
    /([-_])/g,
    (match: string) => (match === '-' ? '+' : '/'),
  );
  const rawPayload = window.atob(payloadFormattedBase64);
  const formattedPayload = rawPayload.replace(
    /(.)/g,
    (match: string, char: string) =>
      `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`,
  );
  const decodedPayload = decodeURIComponent(formattedPayload);

  return JSON.parse(decodedPayload);
}
