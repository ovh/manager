import '@testing-library/jest-dom';
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

vi.mock(import('@ovh-ux/manager-react-components'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useResourcesIcebergV6: vi.fn(),
  };
});

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(() => null),
  Navigate: vi.fn(() => null),
  useLocation: vi.fn(() => ({
    pathname: '',
    search: '',
  })),
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
