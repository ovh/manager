const SCHEME = /^[a-z][a-z0-9+.-]*:\/\//i;

export const toAbsoluteUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  return SCHEME.test(trimmed) ? trimmed : `https://${trimmed}`;
};
