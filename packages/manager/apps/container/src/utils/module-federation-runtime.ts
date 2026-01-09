import { init } from '@module-federation/runtime';

const isProdEnvironment = (): boolean => {
  const { hostname } = window.location;
  return (
    hostname.endsWith('ovh.com') ||
    hostname.endsWith('ovhcloud.com')
  );
};

const getAIChatbotModuleUrl = (): string => {
  if (isProdEnvironment()) {
    return '/ai-chatbot/assets/remoteEntry.js';
  }

  return (
    import.meta.env.VITE_AI_CHATBOT_ENTRY_POINT ||
    'https://www.ovhcloud.com/ai-chatbot/assets/remoteEntry.js'
  );
};

export const initAIChatbotModule = (): void => {
  init({
    name: 'manager-container',
    remotes: [
      {
        name: 'aiChatbot',
        entry: getAIChatbotModuleUrl(),
        type: 'module',
      },
    ],
  });
};
