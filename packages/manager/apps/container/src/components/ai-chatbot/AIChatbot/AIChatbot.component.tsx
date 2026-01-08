import { Suspense, useRef } from 'react';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { useShell } from '@/context';
import useContainer from '@/core/container';
import { useAIChatbotConfig } from '@/hooks/useAIChatbotConfig';
import { AIChatbotModule } from '../AIChatbotModule/AIChatbotModule';
import ChatbotButton from '../ChatbotButton/ChatbotButton.component';
import styles from './AIChatbot.module.scss';

export default function AIChatbot() {
  const {
    aiChatbotOpen,
    aiChatbotReduced,
    isAIChatbotEnabled,
    chatbotOpen,
  } = useContainer();
  const shell = useShell();
  const slotRef = useRef<HTMLDivElement>(null);
  const config = useAIChatbotConfig();

  const environment = shell.getPlugin('environment').getEnvironment();
  const region = environment.getRegion();

  if (region === 'US') {
    return null;
  }

  if (!isAIChatbotEnabled) {
    return null;
  }

  return (
    <div
      data-testid="ai-chatbot-wrapper"
      className={`${styles.wrapper} ${
        aiChatbotOpen ? styles.open : styles.closed
      }`}
    >
      {!chatbotOpen && (
        <div className={styles.buttonContainer}>
          <ChatbotButton />
        </div>
      )}

      {aiChatbotOpen && (
        <div
          ref={slotRef}
          className={`${styles.chatbotContainer} ${
            aiChatbotReduced ? styles.reduced : styles.visible
          }`}
        >
          <Suspense fallback={<OsdsSpinner />}>
            <AIChatbotModule
              key={config.locale}
              slotRef={slotRef}
              config={config}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
