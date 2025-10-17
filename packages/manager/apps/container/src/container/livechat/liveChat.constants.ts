
export const SNOW_INSTANCE_URL = 'https://agent-chat.ovhcloud.com';
export const SNOW_CHAT_QUEUE_STORAGE_KEY = 'snow_chat_queue';
export const CHAT_STATE_STORAGE_KEY = 'chat_state';
export const CHAT_TYPE_STORAGE_KEY = 'chat_type';

export const ADRIELLY_CHAT_ORIGIN = 'https://chatbot.ovhcloud.com';
export function adriellyChatUrl(customerLevel: string, subsidiary: string, language: string): string {
  return `https://chatbot.ovhcloud.com/livechat-manager/${customerLevel}/${subsidiary}_${language}/docs/index2.html`;
}
export const ADRIELLY_LABEU_CHAT_URL = 'https://eceweb.ovhcloud.dev/system/templates/livechat-manager/STD/FR_fr/docs/index2.html';
export const SNOW_LABEU_INSTANCE_URL = 'https://agent-chat.build-ovhcloud.tools';
