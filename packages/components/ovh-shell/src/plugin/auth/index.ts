import {
  redirectToLoginPage,
  redirectToLogoutPage,
} from '@ovh-ux/manager-core-sso';
import ShellClient from '../../client/shell-client';

interface AuthPluginParameters {
  goToLogin?: CallableFunction;
  goToLogout?: CallableFunction;
}

export function auth(params: AuthPluginParameters = {}) {
  const goToLogin = params.goToLogin || redirectToLoginPage;
  const goToLogout = params.goToLogout || redirectToLogoutPage;
  return {
    login: goToLogin,
    logout: goToLogout,
  };
}

export interface ClientAuthApi {
  login: () => void;
  logout: (url?: string) => void;
}

export function clientAuth(shellClient: ShellClient): ClientAuthApi {
  return {
    login: () =>
      shellClient.invokePluginMethod({
        plugin: 'auth',
        method: 'login',
        args: [],
      }),
    logout: (url) =>
      shellClient.invokePluginMethod({
        plugin: 'auth',
        method: 'logout',
        args: [url],
      }),
  };
}

export default auth;
