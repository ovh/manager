import { Environment, ApplicationId, User } from '@ovh-ux/manager-config';
import ShellClient from './shell-client';
import { clientAuth } from '../plugin/auth';
import { clientNavigation } from '../plugin/navigation';
import { exposeTrackingAPI } from '../plugin/tracking';
import { clientLogger } from '../plugin/logger';

export type ShellClientApi = ReturnType<typeof exposeApi>;

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
      setUser: (user: User) =>
        shellClient.invokePluginMethod({
          plugin: 'environment',
          method: 'setUser',
          args: [user],
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
      getAvailableLocales: () =>
        shellClient
          .invokePluginMethod({
            plugin: 'i18n',
            method: 'getAvailableLocales',
          })
          .then((locales) => {
            return locales as { key: string; name: string }[];
          }),
    },
    routing: {
      listenForHashChange: () =>
        window.addEventListener('hashchange', notifyHashChange),
      stopListenForHashChange: () =>
        window.removeEventListener('hashchange', notifyHashChange),
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
      updateMenuSidebarItemLabel: (serviceName: string, label: string) =>
        shellClient.invokePluginMethod({
          plugin: 'ux',
          method: 'updateMenuSidebarItemLabel',
          args: [serviceName, label],
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
      openLiveChat: () =>
        shellClient.invokePluginMethod<void>({
          plugin: 'ux',
          method: 'openLiveChat',
        }),
      openChatbot: () =>
        shellClient.invokePluginMethod<void>({
          plugin: 'ux',
          method: 'openChatbot',
        }),
      closeChatbot: () =>
        shellClient.invokePluginMethod<void>({
          plugin: 'ux',
          method: 'closeChatbot',
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
      showPreloader: () =>
        shellClient.invokePluginMethod<void>({
          plugin: 'ux',
          method: 'showPreloader',
        }),
    },
    navigation: clientNavigation(shellClient),
    tracking: exposeTrackingAPI(shellClient),
    logger: clientLogger(shellClient),
  };
}
