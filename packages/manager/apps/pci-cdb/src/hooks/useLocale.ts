import { useShell } from '@ovh-ux/manager-react-shell-client';
import { useEffect, useState } from 'react';

/**
 * Fetches and keep synced the current locale
 * @returns The current locale string
 */
export function useLocale() {
  const shellCtx = useShell();
  const [locale, setLocale] = useState<string>('fr_FR');
  // fetch initial locale
  useEffect(() => {
    const fetchLocale = async () => {
      const l = (await shellCtx.i18n.getLocale()) as string;
      setLocale(l);
    };
    fetchLocale();
  }, [shellCtx.i18n]);
  // update on locale change
  shellCtx.i18n.onLocaleChange(({ locale: newLocale }: { locale: string }) => {
    setLocale(newLocale);
  });
  return locale;
}
