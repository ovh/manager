import { useTranslation } from 'react-i18next';
import { SvgIconWrapper } from '@ovh-ux/ovh-product-icons/utils/SvgIconWrapper';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';
import { useShell } from '@/context';
import useContainer from '@/core/container';
import styles from './ChatbotButton.module.scss';

export default function ChatbotButton() {
  const { aiChatbotOpen, setAIChatbotOpen, chatbotOpen } = useContainer();
  const shell = useShell();
  const tracking = shell.getPlugin('tracking');
  const { t } = useTranslation('ai-chatbot');

  const handleClick = () => {
    if (chatbotOpen) {
      shell.getPlugin('ux').closeChatbot();
    }
    tracking.trackClick({
      name: `ai-chatbot::${aiChatbotOpen ? 'close' : 'open'}`,
      type: 'action',
      chapter1: 'container',
    });
    setAIChatbotOpen(!aiChatbotOpen);
  };

  return (
    <div className={styles.container}>
      <button
        aria-label={t('ai_chatbot_open')}
        data-testid="ai-chatbot-button"
        onClick={handleClick}
        className={styles.chatbotButton}
      >
        <SvgIconWrapper name={OvhProductName.SPARKLE} width={24} height={24} />
        <span className="sr-only">{t('ai_chatbot_open')}</span>
      </button>
    </div>
  );
}
