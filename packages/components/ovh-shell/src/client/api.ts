import { ApplicationId } from '@ovh-ux/manager-config/types/application';
import { Environment } from '@ovh-ux/manager-config';
import ShellClient from './shell-client';
import { clientAuth } from '../plugin/auth';
import { clientNavigation } from '../plugin/navigation';
import { exposeTrackingAPI } from '../plugin/tracking';

export default function exposeApi(shellClient: ShellClient) {
  const notifyHashChange = () => {
    if (window.parent !== window.self) {
      shellClient.invokePluginMethod({
        plugin: 'routing',
        method: 'onHashChange',
        args: [
          {
            hash: window.location.hash,
            path: window.location.pathname,
          },
        ],
      });
    }
  };
  return {
    environment: {
      getEnvironment: () =>
        shellClient
          .invokePluginMethod({
            plugin: 'environment',
            method: 'getEnvironment',
          })
          .then((environment) => new Environment(environment as Environment)),
      setUniverse: (universe: string) =>
        shellClient.invokePluginMethod({
          plugin: 'environment',
          method: 'setUniverse',
          args: [universe],
        }),
      setApplication: (applicationId: ApplicationId) =>
        shellClient.invokePluginMethod({
          plugin: 'environment',
          method: 'setApplication',
          args: [applicationId],
        }),
    },
    i18n: {
      getLocale: () =>
        shellClient.invokePluginMethod({
          plugin: 'i18n',
          method: 'getLocale',
        }),
      onLocaleChange: (callback: CallableFunction) =>
        shellClient.addEventListener('i18n:locale-change', callback),
      setLocale: (locale: string) =>
        shellClient.invokePluginMethod({
          plugin: 'i18n',
          method: 'setLocale',
          args: [locale],
        }),
    },
    routing: {
      init: () => window.addEventListener('hashchange', notifyHashChange),
      onHashChange: notifyHashChange,
    },
    auth: clientAuth(shellClient),
    ux: {
      // AccountSidebar
      showAccountSidebar: () =>
        shellClient.invokePluginMethod({
          plugin: 'ux',
          method: 'showAccountSidebar',
        }),
      disableAccountSidebarToggle: () =>
        shellClient.invokePluginMethod({
          plugin: 'ux',
          method: 'disableAccountSidebarVisibilityToggle',
        }),
      enableAccountSidebarToggle: () =>
        shellClient.invokePluginMethod({
          plugin: 'ux',
          method: 'enableAccountSidebarVisibilityToggle',
        }),
      isAccountSidebarVisible: () =>
        shellClient.invokePluginMethod({
          plugin: 'ux',
          method: 'isAccountSidebarVisible',
        }),
      setForceAccountSiderBarDisplayOnLargeScreen: (isForced: boolean) => {
        shellClient.invokePluginMethod({
          plugin: 'ux',
          method: 'setForceAccountSiderBarDisplayOnLargeScreen',
          args: [isForced],
        });
      },
      resetAccountSidebar: () =>
        shellClient.invokePluginMethod({
          plugin: 'ux',
          method: 'resetAccountSidebar',
        }),
      isMenuSidebarVisible: () =>
        shellClient.invokePluginMethod({
          plugin: 'ux',
          method: 'isMenuSidebarVisible',
        }),
      showMenuSidebar: () =>
        shellClient.invokePluginMethod({
          plugin: 'ux',
          method: 'showMenuSidebar',
        }),
      onRequestClientSidebarOpen: (callback: CallableFunction) =>
        shellClient.addEventListener('ux:client-sidebar-open', callback),
      getSSOAuthModalMode: (oldUserCookie: string) =>
        shellClient.invokePluginMethod<string>({
          plugin: 'ux',
          method: 'getSSOAuthModalMode',
          args: [oldUserCookie],
        }),
      getUserIdCookie: () =>
        shellClient.invokePluginMethod<string>({
          plugin: 'ux',
          method: 'getUserIdCookie',
        }),
      // Chatbot
      onOpenChatbot: (callback: CallableFunction) =>
        shellClient.addEventListener('ux:open-chatbot', callback),
      onCloseChatbot: (callback: CallableFunction) =>
        shellClient.addEventListener('ux:close-chatbot', callback),
      onReduceChatbot: (callback: CallableFunction) =>
        shellClient.addEventListener('ux:reduce-chatbot', callback),
      onChatbotOpen: () =>
        shellClient.invokePluginMethod<string>({
          plugin: 'ux',
          method: 'onChatbotOpen',
        }),
      onChatbotClose: (reduced: boolean) =>
        shellClient.invokePluginMethod<string>({
          plugin: 'ux',
          method: 'onChatbotClose',
          args: [reduced],
        }),
      isChatbotReduced: () =>
        shellClient.invokePluginMethod<boolean>({
          plugin: 'ux',
          method: 'isChatbotReduced',
        }),
      isChatbotVisible: () =>
        shellClient.invokePluginMethod<boolean>({
          plugin: 'ux',
          method: 'isChatbotVisible',
        }),

      startProgress: () =>
        shellClient.invokePluginMethod<void>({
          plugin: 'ux',
          method: 'startProgress',
        }),
      stopProgress: () =>
        shellClient.invokePluginMethod<void>({
          plugin: 'ux',
          method: 'stopProgress',
        }),
      hidePreloader: () =>
        shellClient.invokePluginMethod<void>({
          plugin: 'ux',
          method: 'hidePreloader',
        }),
    },
    navigation: clientNavigation(shellClient),
    tracking: exposeTrackingAPI(shellClient),
  };
}
