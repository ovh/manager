import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { nichandle } from './__mocks__/nichandle';
import { Path, To } from 'react-router-dom';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (translationKey: string) => translationKey,
      i18n: {
        language: 'fr_FR',
        changeLanguage: () => new Promise(() => { }),
      },
    }),
    getI18n: () => ({
      language: (language: string) => language,
    }),
    Trans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
  };
});

vi.mock(import('@ovh-ux/manager-react-components'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useResourcesIcebergV6: vi.fn(),
    useResourcesIcebergV2: vi.fn(),
    useAuthorizationIam: vi.fn(),
  };
});

vi.mock(import('@/domain/utils/dnsUtils'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    computeDisplayNameServers: vi.fn(),
    canSaveNewDnsConfig: vi.fn(),
  };
});
export const navigate = vi.fn();

vi.mock('react-router-dom', async (importActual) => {
  return {
    ...(await importActual<typeof import('react-router-dom')>()),
    useLocation: vi.fn(() => ({
      pathname: '',
      search: '',
    })),
    useResolvedPath: vi.fn(() => ({
      pathname: '',
    })),
    useNavigate: vi.fn(() => navigate),
    useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
    useMatches: vi.fn(() => []),
    useHref: vi.fn<(url: To) => string>((url) =>
      typeof url === 'string' ? url : (url as Path).pathname,
    ),
    useParams: vi.fn(
      () =>
      ({
        serviceName: 'serviceName',
        domain: 'domain',
      } as Record<string, string | undefined>),
    ),
  };
});

const mocks = vi.hoisted(() => ({
  shell: {
    navigation: {
      getURL: (_: unknown, path: string): Promise<string> => {
        return new Promise<string>((resolve) => {
          return resolve(`https://ovh.test/#${path}`);
        });
      },
    },
  },
  environment: {
    getRegion: vi.fn(() => 'EU'),
    getUserLocale: vi.fn(() => 'fr_FR'),
    getUser: vi.fn(() => {
      return { ovhSubsidiary: 'FR' };
    }),
  },
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useContext: vi.fn(),
  ShellContext: React.createContext({
    shell: mocks.shell,
    environment: mocks.environment,
  }),
  useOvhTracking: vi.fn(() => {
    return {
      trackClick: vi.fn(),
      trackPage: vi.fn(),
      trackCurrentPage: vi.fn(),
    };
  }),
  PageLocation: {
    page: "page",
    funnel: "funnel",
    banner: "banner",
    popup: "pop-up",
    datagrid: "datagrid",
    tile: "tile",
    mainTabnav: "main-tabnav",
  },
  ButtonType: {
    button: "button",
    link: "link",
    select: "select",
    externalLink: "external-link",
    tile: "tile",
    tutorial: "tile-tutorial",
    tab: "go-to-tab",
  },
  useNavigationGetUrl: (
    linkParams: [string, string, unknown],
  ): UseQueryResult<unknown, Error> => {
    return {
      data: `https://ovh.test/#/${linkParams[0]}${linkParams[1]}`,
    } as UseQueryResult<unknown, Error>;
  },
  useNavigation: () => ({
    navigateTo: vi.fn(),
  }),
}));

vi.mock('@/common/hooks/nichandle/useNichandleInformation', () => ({
  useNichandleInformation: vi.fn(() => {
    return {
      nichandleInformation: nichandle,
    };
  }),
}));

vi.mock('@ovh-ux/manager-module-order', () => {
  return {
    getExpressOrderURL: () => 'https://order.eu.ovhcloud.com/fr',
    getOrderURL: () => 'https://order.eu.ovhcloud.com/fr',
  };
});

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Mock window.open for tests
vi.stubGlobal('open', vi.fn());

// Add a fake close() method because jsdom doesn't support HTMLDialogElement.
// Without this mock, components using <dialog> (like the ODS Drawer) would crash during tests.
Object.defineProperty(global.HTMLDialogElement.prototype, 'close', {
  value: vi.fn(),
});

// Filter out noisy logs from i18next translation loading
const originalConsoleInfo = console.info;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

console.info = (...args: unknown[]) => {
  const message = args.join(' ');
  // Suppress translation/jsdom loading logs
  if (
    message.includes('Loading fallback language') ||
    message.includes('namespace:') ||
    message.includes('Language changed to')
  ) {
    return;
  }
  originalConsoleInfo(...args);
};

console.log = (...args: unknown[]) => {
  const message = args.join(' ');
  // Suppress translation change logs
  if (message.includes('Language changed to:')) {
    return;
  }
  originalConsoleLog(...args);
};

console.warn = (...args: unknown[]) => {
  const message = args.join(' ');
  // Suppress translation fallback warnings
  if (
    message.includes('Could not load') &&
    message.includes('Will fallback to')
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

console.error = (...args: unknown[]) => {
  const message = args.join(' ');
  // Suppress XMLHttpRequest AggregateError from jsdom
  if (message.includes('AggregateError') || message.includes('xhr-utils')) {
    return;
  }
  originalConsoleError(...args);
};
