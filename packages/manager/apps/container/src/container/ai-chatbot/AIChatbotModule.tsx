import { lazy, useEffect } from 'react';
import { loadRemote } from '@module-federation/runtime';
import { AIChatbotConfig, AIChatbotSetupFunction } from '@/types/AIChatbot.type';

type AIChatbotModuleProps = {
  slotRef: React.RefObject<HTMLDivElement>;
  config: AIChatbotConfig;
};

export const AIChatbotModule = lazy(() =>
  loadRemote<{ default: AIChatbotSetupFunction }>('aiChatbot/AIChatbot').then(
    (module): { default: React.ComponentType<AIChatbotModuleProps> } => {
      if (!module) {
        throw new Error('Failed to load AIChatbot module');
      }

      const setupFunction: AIChatbotSetupFunction =
        typeof module === 'function' ? module : module.default;

      const AIChatbotWrapper = ({ slotRef, config }: AIChatbotModuleProps) => {
        useEffect(() => {
          const element = slotRef.current;
          if (!element) {
            return undefined;
          }

          setupFunction(element, { configuration: config });

          return () => {
            if (element) {
              element.innerHTML = '';
            }
          };
        }, [slotRef, config]);

        return null;
      };

      return {
        default: AIChatbotWrapper,
      };
    },
  ),
);
