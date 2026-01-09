import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export function useQuantum(namespace?: string) {
  const { t: tOrig } = useTranslation(namespace);
  const location = useLocation();

  const pathWithHash = `${location.pathname ?? ''}${location.hash ??
    ''}`.toLowerCase();

  const mode: 'emulators' | 'qpu' | 'ai' = (() => {
    if (pathWithHash.includes('/quantum/qpu')) return 'qpu';
    if (pathWithHash.includes('/quantum/')) return 'emulators';
    return 'ai';
  })();

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const t = (key: string) => {
    if (mode === 'emulators') {
      return tOrig([`quantum${capitalize(key)}`, key]);
    }
    if (mode === 'qpu') {
      return tOrig([`qpu${capitalize(key)}`, key]);
    }
    return tOrig(key);
  };

  return {
    mode,
    isQuantum: mode === 'emulators',
    isQpu: mode === 'qpu',
    t,
  };
}
