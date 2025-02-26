import { vi } from 'vitest';
import '@testing-library/jest-dom';

export const tMock = vi.fn((key: string) => key);

export const PageType = {
  popup: 'popup',
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: tMock,
  }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const actual = await import('@ovh-ux/manager-react-shell-client');
  return {
    ...actual,
    useOvhTracking: () => ({
      trackClick: vi.fn(),
      trackCurrentPage: vi.fn(),
      trackPage: vi.fn(),
      pageType: actual.PageType.popup,
    }),
  };
});
