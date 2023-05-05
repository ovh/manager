import { Environment, ApplicationId } from '@ovh-ux/manager-config';

type ShellClient = {
  environment: {
    getEnvironment: () => PromiseLike<Environment>;
    setUniverse: (universe: string) => PromiseLike<unknown>;
    setApplication: (applicationId: ApplicationId) => PromiseLike<unknown>;
  };
  i18n: {
    getLocale: () => PromiseLike<unknown>;
    onLocaleChange: (callback: CallableFunction) => void;
    setLocale: (locale: string) => PromiseLike<unknown>;
    getAvailableLocales: () => PromiseLike<
      {
        key: string;
        name: string;
      }[]
    >;
  };
  routing: {
    listenForHashChange: () => void;
    stopListenForHashChange: () => void;
    onHashChange: () => void;
  };
  auth: import('@ovh-ux/shell/src/plugin/auth').ClientAuthApi;
  ux: {
    showAccountSidebar: () => PromiseLike<unknown>;
    disableAccountSidebarToggle: () => PromiseLike<unknown>;
    enableAccountSidebarToggle: () => PromiseLike<unknown>;
    isAccountSidebarVisible: () => PromiseLike<unknown>;
    setForceAccountSiderBarDisplayOnLargeScreen: (isForced: boolean) => void;
    resetAccountSidebar: () => PromiseLike<unknown>;
    isMenuSidebarVisible: () => PromiseLike<unknown>;
    showMenuSidebar: () => PromiseLike<unknown>;
    updateMenuSidebarItemLabel: (
      serviceName: string,
      label: string,
    ) => PromiseLike<unknown>;
    onRequestClientSidebarOpen: (callback: CallableFunction) => void;
    getSSOAuthModalMode: (oldUserCookie: string) => PromiseLike<string>;
    getUserIdCookie: () => PromiseLike<string>;
    onOpenChatbot: (callback: CallableFunction) => void;
    onCloseChatbot: (callback: CallableFunction) => void;
    onReduceChatbot: (callback: CallableFunction) => void;
    onChatbotOpen: () => PromiseLike<string>;
    onChatbotClose: (reduced: boolean) => PromiseLike<string>;
    openLiveChat: () => PromiseLike<void>;
    openChatbot: () => PromiseLike<void>;
    closeChatbot: () => PromiseLike<void>;
    isChatbotReduced: () => PromiseLike<boolean>;
    isChatbotVisible: () => PromiseLike<boolean>;
    startProgress: () => PromiseLike<void>;
    stopProgress: () => PromiseLike<void>;
    hidePreloader: () => PromiseLike<void>;
    showPreloader: () => PromiseLike<void>;
  };
  navigation: import('@ovh-ux/shell/src/plugin/navigation').ClientNavigationApi;
  tracking: import('@ovh-ux/shell/src/plugin/tracking').TrackingAPI;
  logger: {
    log: (...args: unknown[]) => PromiseLike<unknown>;
    info: (...args: unknown[]) => PromiseLike<unknown>;
    warn: (...args: unknown[]) => PromiseLike<unknown>;
    error: (...args: unknown[]) => PromiseLike<unknown>;
    debug: (...args: unknown[]) => PromiseLike<unknown>;
  };
};

let shellClient: ShellClient;

export const setShellClient = (client: ShellClient) => {
  shellClient = client;

  // set callbacks
  // set on locale change
  shellClient.i18n.onLocaleChange(() => {
    window.top.location.reload();
  });

  return shellClient;
};

export const getShellClient = () => {
  return shellClient;
};

export default { setShellClient, getShellClient };
