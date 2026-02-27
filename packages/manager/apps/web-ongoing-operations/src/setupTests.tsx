import '@testing-library/jest-dom';
import '@ovh-ux/manager-static-analysis-kit/tests/html-a11y-tests-setup';
import '@ovh-ux/manager-static-analysis-kit/tests/html-w3c-tests-setup';
import { vi } from 'vitest';
import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { NavLinkProps } from 'react-router-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => { }),
    },
  }),
  getI18n: () => ({
    language: (language: string) => language,
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
}));

vi.mock('@ovh-ux/manager-core-api', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-core-api');
  return {
    ...mod,
    fetchIcebergV6: vi.fn(),
    v6: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  };
});

vi.mock(import('@tanstack/react-query'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock(import('@ovh-ux/manager-react-components'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useResourcesIcebergV6: vi.fn(),
    useAuthorizationIam: vi.fn(),
    useFeatureAvailability: vi.fn(),
  };
});

vi.mock('@/utils/utils', () => ({
  removeQuotes: vi.fn(),
  getLanguageKey: vi.fn(),
}));

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
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    shell: mocks.shell,
  }),
  useNavigationGetUrl: (
    linkParams: [string, string, unknown],
  ): UseQueryResult<unknown, Error> => {
    return {
      data: `https://ovh.test/#/${linkParams[0]}${linkParams[1]}`,
    } as UseQueryResult<unknown, Error>;
  },
  useOvhTracking: vi.fn(() => {
    return {
      trackClick: vi.fn(),
      trackPage: vi.fn(),
      trackCurrentPage: vi.fn(),
    };
  }),
}));

vi.mock('@ovhcloud/ods-components/react', async () => {
  const originalModule = await vi.importActual(
    '@ovhcloud/ods-components/react',
  );

  return {
    ...originalModule,
    OdsRadio: () => <input type="radio" />,
    OdsCheckbox: () => <input type="checkbox" />,
    OdsSelect: () => <select></select>,
  };
});

vi.mock('@/hooks/nichandle/useNichandle', () => ({
  useNichandle: vi.fn(() => {
    return {
      nichandle: 'ca0000-ovh',
    };
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(() => null),
  useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
  Navigate: vi.fn(() => null),
  useLocation: vi.fn(() => ({
    pathname: '',
    search: '',
  })),
  useResolvedPath: vi.fn(() => ({
    pathname: '',
  })),
  useParams: () => {
    return {
      serviceName: 'foobar',
      id: '1',
    };
  },
  NavLink: ({ ...params }: NavLinkProps) => params.children,
  Outlet: vi.fn(),
}));

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
