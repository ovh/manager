import { Suspense, useRef } from 'react';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { useShell } from '@/context';
import useContainer from '@/core/container';
import { useAIChatbotConfig } from '@/hooks/useAIChatbotConfig';
import { AIChatbotModule } from './AIChatbotModule';
import ChatbotButton from './ChatbotButton.component';

export default function AIChatbot() {
  const { aiChatbotOpen, aiChatbotReduced, isAIChatbotEnabled } = useContainer();
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
    <>
      {!aiChatbotOpen && <ChatbotButton />}

      {aiChatbotOpen && (
        <div
          data-testid="ai-chatbot-wrapper"
          className="fixed w-full h-full xl:h-fit xl:w-auto bottom-0 xl:bottom-2 right-0 xl:right-2 z-[960] flex flex-col justify-end pointer-events-none"
        >
          <div
            ref={slotRef}
            className={`ai-chatbot-container pointer-events-auto ${
              aiChatbotReduced ? 'hidden' : 'block'
            }`}
          >
            <Suspense fallback={<OsdsSpinner />}>
              <AIChatbotModule slotRef={slotRef} config={config} />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
}
