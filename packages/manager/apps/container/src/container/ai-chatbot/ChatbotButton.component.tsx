import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import useContainer from '@/core/container';

export default function ChatbotButton() {
  const { setAIChatbotOpen } = useContainer();
  const shell = useShell();
  const tracking = shell.getPlugin('tracking');
  const { t } = useTranslation('ai-chatbot');

  const handleClick = () => {
    tracking.trackClick({
      name: 'ai-chatbot::open',
      type: 'action',
      chapter1: 'container',
    });
    setAIChatbotOpen(true);
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[970]">
      <OsdsButton
        aria-label={t('ai_chatbot_open')}
        data-testid="ai-chatbot-button"
        circle
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={handleClick}
        className="bg-gradient-to-br from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
      >
        <OsdsIcon
          name={ODS_ICON_NAME.SPEECH_BUBBLE_CONCEPT}
          size={ODS_ICON_SIZE.md}
          contrasted
          className="m-2"
        />
        <span className="sr-only">{t('ai_chatbot_open')}</span>
      </OsdsButton>
    </div>
  );
}
