import { useSyncExternalStore } from 'react';

const MD_QUERY = '(min-width: 48em)';

function subscribe(cb: () => void) {
  const mql = globalThis.matchMedia(MD_QUERY);
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
}

function getSnapshot() {
  return globalThis.matchMedia(MD_QUERY).matches;
}

function getServerSnapshot() {
  return true;
}

export function useIsDesktop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
