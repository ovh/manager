import { useShell } from '@ovh-ux/manager-react-shell-client';
import { useEffect, useState } from 'react';

export enum Locale {
  'fr_FR' = 'fr_FR',
  'de_DE' = 'de_DE',
  'en_GB' = 'en_GB',
  'es_ES' = 'es_ES',
  'fr_CA' = 'fr_CA',
  'it_IT' = 'it_IT',
  'pl_PL' = 'pl_PL',
  'pt_PT' = 'pt_PT',
}

/**
 * Fetches and keep synced the current locale
 * @returns The current locale string
 */
export function useLocale() {
  const shellCtx = useShell();
  const [locale, setLocale] = useState<Locale>(Locale.fr_FR);
  // fetch initial locale
  useEffect(() => {
    const fetchLocale = async () => {
      const l = (await shellCtx.i18n.getLocale()) as Locale;
      setLocale(l);
    };
    fetchLocale();
  }, [shellCtx.i18n]);
  // update on locale change
  shellCtx.i18n.onLocaleChange(({ locale: newLocale }: { locale: string }) => {
    setLocale(newLocale as Locale);
  });
  return locale;
}
