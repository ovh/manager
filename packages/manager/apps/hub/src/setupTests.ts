import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import * as i18nextModule from 'react-i18next';
import { vi } from 'vitest';

import '@ovh-ux/manager-static-analysis-kit/tests/html-w3c-tests-setup';

vi.mock('react-i18next', async (importOriginal) => {
  const original: typeof i18nextModule = await importOriginal();
  return {
    ...original,
    useTranslation: () => ({
      t: (translationKey: string) => translationKey,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }),
  };
});
