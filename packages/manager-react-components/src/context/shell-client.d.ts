import { ApplicationId } from './application';
import IMessageBus from './message-bus/IMessageBus';
import { IShellPluginMethodCall, IShellPluginResult } from '../common';

export interface IDeferred {
  resolve: (value: unknown | PromiseLike<unknown>) => void;
  reject: (reason?: unknown) => void;
}
export default class ShellClient {
  deferredResponse: Record<string, IDeferred>;

  eventListeners: Record<string, CallableFunction[]>;

  messageBus: IMessageBus;

  applicationId: ApplicationId;

  constructor();

  setMessageBus(bus: IMessageBus): void;

  setApplicationId(id: ApplicationId): void;

  getApplicationId(): ApplicationId;

  getUniqueResponseId(): string;

  handlePluginResult(data: IShellPluginResult): void;

  addEventListener(eventId: string, callback: CallableFunction): void;

  invokePluginMethod<T>({
    plugin,
    method,
    args,
  }: IShellPluginMethodCall): PromiseLike<T>;

  getApi(): {
    environment: {
      getEnvironment: () => PromiseLike<
        import('@ovh-ux/manager-config').Environment
      >;
      setUniverse: (universe: string) => PromiseLike<unknown>;
      setApplication: (applicationId: string) => PromiseLike<unknown>;
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
    auth: import('../plugin/auth').ClientAuthApi;
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
    navigation: import('../plugin/navigation').ClientNavigationApi;
    tracking: import('../plugin/tracking').TrackingAPI;
    logger: {
      log: (...args: unknown[]) => PromiseLike<unknown>;
      info: (...args: unknown[]) => PromiseLike<unknown>;
      warn: (...args: unknown[]) => PromiseLike<unknown>;
      error: (...args: unknown[]) => PromiseLike<unknown>;
      debug: (...args: unknown[]) => PromiseLike<unknown>;
    };
  };
}
