import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import { AIChatbotConfig } from '@/types/AIChatbot.type';
import useContainer from '@/core/container';

export const useAIChatbotConfig = (): AIChatbotConfig => {
  const shell = useShell();
  const { i18n } = useTranslation();
  const { setAIChatbotOpen } = useContainer();

  const environment = shell.getPlugin('environment').getEnvironment();
  const tracking = shell.getPlugin('tracking');

  return useMemo(
    () => ({
      baseUrl: window.location.origin,
      locale: environment.getUserLanguage(),
      envIsProd: window.location.hostname.endsWith('ovh.com') || window.location.hostname.endsWith('ovhcloud.com'),
      linkPolicy: 'same-window',
      onClose: () => {
        setAIChatbotOpen(false);
      },
      onTracking: (event) => {
        tracking.trackClick({
          name: `ai-chatbot::${event.action}`,
          type: 'action',
        });
      },
    }),
    [environment, i18n.language, setAIChatbotOpen, tracking],
  );
};
