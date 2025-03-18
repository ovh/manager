
export const SNOW_INSTANCE_URL = 'https://agent-chat.build-ovhcloud.tools';
export const SNOW_CHAT_QUEUE_STORAGE_KEY = 'snow_chat_queue';
export const CHAT_STATE_STORAGE_KEY = 'chat_state';
export const CHAT_TYPE_STORAGE_KEY = 'chat_type';

export const ADRIELLY_CHAT_ORIGIN = 'https://chat.ovh.com';
export function adriellyChatUrl(customerLevel: string, subsidiary: string, language: string): string {
  return `https://chat.ovh.com/system/templates/pre-prod/LiveChat_V4/conversation/${customerLevel}/${subsidiary}_${language}/docs/index2.html`;
}
