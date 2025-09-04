import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';

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
  };
});

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(() => null),
  Navigate: vi.fn(() => null),
  useLocation: vi.fn(() => ({
    pathname: '',
    search: '',
  })),
  useParams: () => {
    return {
      id: '1',
    };
  },
  Outlet: vi.fn(),
  useHref: vi.fn(),
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
  environment: {
    getRegion: vi.fn(),
    getUserLocale: vi.fn(() => 'fr_FR'),
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
}));

vi.mock('@/alldoms/hooks/nichandle/useNichandle', () => ({
  useNichandle: vi.fn(() => {
    return {
      nichandle: 'aa00001-ovh',
    };
  }),
}));
