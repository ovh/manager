import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { vi } from 'vitest';
import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  getI18n: () => ({
    language: (language: string) => language,
  }),
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
  };
});

vi.mock('@/utils/utils', () => ({
  formatDatagridDate: vi.fn(),
  removeQuotes: vi.fn(),
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
}));

vi.mock('@ovhcloud/ods-components/react', async () => {
  const originalModule = await vi.importActual(
    '@ovhcloud/ods-components/react',
  );

  return {
    ...originalModule,
    OdsRadio: () => <input type="radio" />,
  };
});

vi.mock('@/hooks/nichandle/useNichandle', () => ({
  useNichandle: vi.fn(() => {
    return {
      nichandle: 'ca0000-ovh',
    };
  }),
}));
