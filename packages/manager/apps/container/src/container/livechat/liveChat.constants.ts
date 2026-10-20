export const SNOW_CHAT_QUEUE_STORAGE_KEY = 'snow_chat_queue';
export const CHAT_STATE_STORAGE_KEY = 'chat_state';
export const CHAT_TYPE_STORAGE_KEY = 'chat_type';

export const ADRIELLY_CHAT_ORIGIN = 'https://chatbot.ovhcloud.com';
export const SNOW_CHAT_TARGET =
  'aHR0cHM6Ly9hZ2VudC1jaGF0LmJ1aWxkLW92aGNsb3VkLnRvb2xz';
export const ADRIELLY_LABEU_TARGET =
  'aHR0cHM6Ly9lY2V3ZWIub3ZoY2xvdWQuZGV2L3N5c3RlbS90ZW1wbGF0ZXMvbGl2ZWNoYXQtbWFuYWdlci9TVEQvRlJfZnIvZG9jcy9pbmRleDIuaHRtbA==';
export const ADRIELLY_PREPROD_TARGET =
  'aHR0cHM6Ly9jaGF0Lm92aC5jb20vc3lzdGVtL3RlbXBsYXRlcy9wcmUtcHJvZC9wcmVwYV9wcm9kL1NURC9GUl9mci9kb2NzL2luZGV4Mi5odG1s';

export function adriellyChatUrl(customerLevel: string, subsidiary: string, language: string): string {
  return `https://chatbot.ovhcloud.com/livechat-manager/${customerLevel}/${subsidiary}_${language}/docs/index2.html`;
}
