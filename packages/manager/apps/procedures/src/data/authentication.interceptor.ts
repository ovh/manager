import { v6 } from '@ovh-ux/manager-core-api';

export const initAuthenticationInterceptor = (token: string | null) => {
  v6.interceptors.request.use((request) => {
    if (token) {
      request.headers['X-Ovh-Token'] = `Bearer ${token}`;
    }
    return request;
  });
};

export default initAuthenticationInterceptor;
