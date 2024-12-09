import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import React from 'react';
import { vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

const mocks = vi.hoisted(() => ({
  environment: {
    getRegion: vi.fn(() => 'EU'),
    getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })),
  },
  shell: {
    navigation: {
      getURL: vi.fn().mockResolvedValue('mocked-url'),
    },
  },
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    shell: mocks.shell,
    environment: mocks.environment,
  }),
  ButtonType: {
    link: 'link',
  },
}));
