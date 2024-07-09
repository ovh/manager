import { vi } from 'vitest';
import { ShellClientApi } from '@ovh-ux/shell';
import { Environment } from '@ovh-ux/manager-config';
import { ShellProvider } from '@ovh-ux/manager-react-shell-client';
import { HashRouterWithLocationWrapper } from './RouterWithLocationWrapper';
import { QueryClientWrapper } from './QueryClientWrapper';
import { mockedUser } from '../mocks/userOVH';

export const RouterWithQueryClientWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const client = {
    environment: {
      region: 'EU',
      userLocale: 'en-GB',
      version: '1',
      user: mockedUser,
      applicationName: 'pci-ai-dashboard',
      universe: 'pci',
      applicationURLs: {},
      message: {
        nl: {
          description: '',
        },
        fr: {
          description: '',
        },
        en: {
          description: '',
        },
        de: {
          description: '',
        },
        es: {
          description: '',
        },
        it: {
          description: '',
        },
        pl: {
          description: '',
        },
        pt: {
          description: '',
        },
      },
      applications: {},
      setRegion: vi.fn(),
      getRegion: vi.fn(),
      setUser: vi.fn(),
      getUser: vi.fn(),
      setUserLocale: vi.fn(),
      getUserLocale: vi.fn(),
      getUserLanguage: vi.fn(),
      setVersion: vi.fn(),
      getVersion: vi.fn(),
      setApplicationName: vi.fn(),
      getApplicationName: vi.fn(),
      getApplication: vi.fn(),
      setUniverse: vi.fn(),
      setUniverseFromApplicationId: vi.fn(),
      getUniverse: vi.fn(),
      setApplicationURLs: vi.fn(),
      getApplicationURLs: vi.fn(),
      getApplicationURL: vi.fn(),
      setMessage: vi.fn(),
      getMessage: vi.fn(),
      getApplications: vi.fn(),
      setApplications: vi.fn(),
    },
    shell: {
      environment: {
        getEnvironment: vi.fn(),
        setUniverse: vi.fn(),
        setApplication: vi.fn(),
      },
      i18n: {
        getLocale: vi.fn(),
        onLocaleChange: vi.fn(),
        setLocale: vi.fn(),
        getAvailableLocales: vi.fn(),
      },
      routing: {
        listenForHashChange: vi.fn(),
        stopListenForHashChange: vi.fn(),
        onHashChange: vi.fn(),
      },
      auth: {
        login: vi.fn(),
        logout: vi.fn(),
      },
      ux: {
        showAccountSidebar: vi.fn(),
        disableAccountSidebarToggle: vi.fn(),
        enableAccountSidebarToggle: vi.fn(),
        isAccountSidebarVisible: vi.fn(),
        setForceAccountSiderBarDisplayOnLargeScreen: vi.fn(),
        resetAccountSidebar: vi.fn(),
        isMenuSidebarVisible: vi.fn(),
        showMenuSidebar: vi.fn(),
        updateMenuSidebarItemLabel: vi.fn(),
        onRequestClientSidebarOpen: vi.fn(),
        getSSOAuthModalMode: vi.fn(),
        getUserIdCookie: vi.fn(),
        onOpenChatbot: vi.fn(),
        onCloseChatbot: vi.fn(),
        onReduceChatbot: vi.fn(),
        onChatbotOpen: vi.fn(),
        onChatbotClose: vi.fn(),
        openLiveChat: vi.fn(),
        openChatbot: vi.fn(),
        closeChatbot: vi.fn(),
        isChatbotReduced: vi.fn(),
        isChatbotVisible: vi.fn(),
        startProgress: vi.fn(),
        stopProgress: vi.fn(),
        hidePreloader: vi.fn(),
        showPreloader: vi.fn(),
      },
      navigation: {
        getURL: vi.fn(),
        navigateTo: vi.fn(),
        reload: vi.fn(),
      },
      tracking: {
        setPciProjectMode: vi.fn(),
        init: vi.fn(),
        onConsentModalDisplay: vi.fn(),
        onUserConsentFromModal: vi.fn(),
        setConfig: vi.fn(),
        setDefaults: vi.fn(),
        setRegion: vi.fn(),
        trackClick: vi.fn(),
        trackClickImpression: vi.fn(),
        trackEvent: vi.fn(),
        trackImpression: vi.fn(),
        trackMVTest: vi.fn(),
        trackPage: vi.fn(),
      },
      logger: {
        log: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
      },
    },
  } as {
    shell: ShellClientApi;
    environment: Environment;
  };
  return (
    <ShellProvider client={client}>
      <QueryClientWrapper>
        <HashRouterWithLocationWrapper>
          {children}
        </HashRouterWithLocationWrapper>
      </QueryClientWrapper>
    </ShellProvider>
  );
};
