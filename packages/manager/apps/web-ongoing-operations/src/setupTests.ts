import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { vi } from 'vitest';

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

vi.mock('@/utils/utils', () => ({
  formatDate: vi.fn(),
  removeString: vi.fn(),
}));

vi.mock('@/utils/utils', () => ({
  formatDate: vi.fn(),
  removeString: vi.fn(),
}));
