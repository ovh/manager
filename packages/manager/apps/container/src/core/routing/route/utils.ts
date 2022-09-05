export function appendSlash(s: string): string {
  return (s || '').replace(/([^/])$/, '$1/');
}

export function removeHashbang(h: string): string {
  return h.replace(/^[^/]+/, '');
}

export default {
  appendSlash,
  removeHashbang,
};
