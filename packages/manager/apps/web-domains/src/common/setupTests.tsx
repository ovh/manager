import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { nichandle } from './__mocks__/nichandle';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      language: 'fr_FR',
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  getI18n: () => ({
    language: (language: string) => language,
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
}));

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

vi.mock('react-router-dom', () => {
  return {
    useNavigate: vi.fn(() => vi.fn()),
    Navigate: vi.fn(() => null),
    Outlet: vi.fn(),
    useHref: vi.fn(),
    useLocation: vi.fn(() => ({
      pathname: '',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    })),
    useParams: vi.fn(() => ({
      serviceName: 'foobar',
      id: '1',
    })),
    useMatch: vi.fn(),
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
    getRegion: vi.fn(),
    getUserLocale: vi.fn(() => 'fr_FR'),
    getUser: vi.fn(() => {
      return { ovhSubsidiary: 'FR' };
    }),
  },
}));
const trackClickMock = vi.fn();

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useContext: vi.fn(),
  ShellContext: React.createContext({
    shell: mocks.shell,
    environment: mocks.environment,
  }),
  useOvhTracking: () => ({ trackClick: trackClickMock }),
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

// Add a fake close() method because jsdom doesn't support HTMLDialogElement.
// Without this mock, components using <dialog> (like the ODS Drawer) would crash during tests.
Object.defineProperty(global.HTMLDialogElement.prototype, 'close', {
  value: vi.fn(),
});
