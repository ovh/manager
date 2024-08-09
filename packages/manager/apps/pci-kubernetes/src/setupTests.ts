import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { vi } from 'vitest';

vi.mock('react-i18next', async () => {
  const mod = await vi.importActual('react-i18next');
  return {
    ...mod,
    useTranslation: () => ({
      t: (translationKey: string) => translationKey,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }),
  };
});
