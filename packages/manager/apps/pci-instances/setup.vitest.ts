import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      exists: () => true,
    },
  }),
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();

  return {
    ...actual,
    useProjectUrl: () => '/foo/bar',
    useNotifications: vi.fn(),
  };
});

vi.mock('@/hooks/project/useProjectId', () => ({
  useProjectId: () => '8c8c4fd6d4414aa29fc777752b00005198664',
}));
