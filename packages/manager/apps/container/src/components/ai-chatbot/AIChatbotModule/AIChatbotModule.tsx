import { lazy, useEffect, useRef } from 'react';
import { loadRemote } from '@module-federation/runtime';
import {
  AIChatbotConfig,
  AIChatbotInstance,
  AIChatbotModule as AIChatbotModuleType,
} from '@/types/AIChatbot.type';

type AIChatbotModuleProps = {
  slotRef: React.RefObject<HTMLDivElement>;
  config: AIChatbotConfig;
};

export const AIChatbotModule = lazy(() =>
  loadRemote<AIChatbotModuleType>('aiChatbot/ChatBot').then((module): {
    default: React.ComponentType<AIChatbotModuleProps>;
  } => {
    if (!module) {
      throw new Error('Failed to load AIChatbot module');
    }

    const ChatBotModule = module as unknown as AIChatbotModuleType;

    const AIChatbotWrapper = ({
      slotRef,
      config,
    }: AIChatbotModuleProps): null => {
      const chatbotInstanceRef = useRef<AIChatbotInstance | null>(null);

      useEffect(() => {
        const element = slotRef.current;
        if (!element) {
          return undefined;
        }

        if (chatbotInstanceRef.current) {
          chatbotInstanceRef.current.unmount();
        }

        chatbotInstanceRef.current = ChatBotModule.render(element, config);

        return (): void => {
          if (chatbotInstanceRef.current) {
            chatbotInstanceRef.current.unmount();
            chatbotInstanceRef.current = null;
          }
        };
      }, [slotRef, config]);

      return null;
    };

    return {
      default: AIChatbotWrapper,
    };
  }),
);
