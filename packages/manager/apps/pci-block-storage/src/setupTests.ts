import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { vi } from 'vitest';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useTranslation: () => ({
      t: (translationKey: string) => translationKey,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }),
    Trans: (params) => params.i18nKey,
  };
});

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: vi.fn(),
  useHref: vi.fn(),
}));
