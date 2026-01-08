import { init } from '@module-federation/runtime';

const AI_CHATBOT_MODULE_URL =
  'https://www.ovhcloud.com/website/assistant_ia/assets/remoteEntry.js';

export const initAIChatbotModule = (): void => {
  try {
    init({
      name: 'manager-container',
      remotes: [
        {
          name: 'aiChatbot',
          entry: AI_CHATBOT_MODULE_URL,
          type: 'module',
        },
      ],
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize AI Chatbot module federation:', error);
  }
};
