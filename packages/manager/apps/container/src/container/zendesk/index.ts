import { SUPPORT_CHAT_TOKEN_ENDPOINT } from './zendesk.constants';

export const setupZendeskConfig = (): void => {
  window.zESettings = {
    webWidget: {
      authenticate: {
        chat: {
          jwtFn(callback) {
            fetch(SUPPORT_CHAT_TOKEN_ENDPOINT)
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
              })
              .then((res) => callback(res?.token || ''))
              .catch(() => callback(''));
          },
        },
      },
    },
  };
};
