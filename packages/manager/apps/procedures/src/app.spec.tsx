import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

import React from 'react';

const mocks = vi.hoisted(() => ({
  user: {
    subsidiary: 'FR',
  },
  initI18n: {
    default: vi.fn(() => ({})),
  },
}));

vi.mock('./i18n', () => mocks.initI18n);

vi.mock('@/utils/token', () => ({
  extractToken: () => '',
  decodeToken: () => mocks.user,
}));

describe('App', () => {
  beforeEach(() => {
    // This is done because the code using navigator.language is outside the App component's function
    // This denote bad code, we should probably rethink how language is extracted
    vi.resetModules();
    // This is done to have initI18n call history reset, and expectations working
    vi.restoreAllMocks();
  });

  it.each([
    ['fr_FR', 'FR', 'fr_FR'],
    ['fr_MA', 'FR', 'fr_FR'],
    ['en_CA', 'CA', 'en_GB'],
    ['hi_IN', 'IN', 'en_GB'],
    ['es_MX', 'WS', 'es_ES'],
    ['es-419', 'ES', 'es_ES'],
  ])(
    'should call init18n with %s locale and %s subsidiary',
    async (locale, subsidiary, firstParam) => {
      vi.spyOn(global.window.navigator, 'language', 'get').mockImplementation(
        () => locale,
      );
      mocks.user.subsidiary = subsidiary;

      const { default: App } = await import('@/App');

      render(<App />);
      expect(mocks.initI18n.default).toHaveBeenCalledWith(
        firstParam,
        subsidiary,
      );
    },
  );
});
