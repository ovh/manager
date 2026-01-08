import { useEffect, useMemo, useState } from 'react';
import i18next from 'i18next';
import { useShell } from '@/context';
import { AIChatbotConfig } from '@/types/AIChatbot.type';
import useContainer from '@/core/container';

const PRIVACY_POLICY_URLS: Record<string, string> = {
  fr_FR: 'https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/',
  es_ES: 'https://www.ovhcloud.com/es-es/terms-and-conditions/privacy-policy/',
  de_DE: 'https://www.ovhcloud.com/de/terms-and-conditions/privacy-policy/',
  en_GB: 'https://www.ovhcloud.com/en-gb/terms-and-conditions/privacy-policy/',
  it_IT: 'https://www.ovhcloud.com/it/terms-and-conditions/privacy-policy/',
  pt_PT: 'https://www.ovhcloud.com/pt/terms-and-conditions/privacy-policy/',
  pl_PL: 'https://www.ovhcloud.com/pl/terms-and-conditions/privacy-policy/',
  fr_CA: 'https://www.ovhcloud.com/fr-ca/terms-and-conditions/privacy-policy/',
};

const DEFAULT_PRIVACY_POLICY_URL =
  'https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/';

export const useAIChatbotConfig = (): AIChatbotConfig => {
  const shell = useShell();
  const { setAIChatbotOpen } = useContainer();
  const tracking = shell.getPlugin('tracking');

  const [locale, setLocale] = useState(i18next.language);

  useEffect(() => {
    const handleLanguageChange = (newLocale: string) => {
      setLocale(newLocale);
    };

    i18next.on('languageChanged', handleLanguageChange);

    return () => {
      i18next.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const linkPolicy = PRIVACY_POLICY_URLS[locale] || DEFAULT_PRIVACY_POLICY_URL;

  return useMemo(
    () => ({
      locale,
      linkPolicy,
      onClose: () => {
        setAIChatbotOpen(false);
      },
      onTracking: (event) => {
        tracking.trackClick({
          name: `ai-chatbot::${event}`,
          type: 'action',
        });
      },
    }),
    [locale, linkPolicy, setAIChatbotOpen, tracking],
  );
};
