import { vi } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';
import { NavLinkProps } from 'react-router-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: { language: 'fr_FR' },
  }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const original = await vi.importActual('@ovh-ux/manager-react-shell-client');
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: vi.fn(), trackPage: vi.fn() }),
  };
});

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => ({ navigate: vi.fn() }),
    useSearchParams: () => [{ get: (str: string) => str }],
    useLocation: vi.fn().mockReturnValue({
      pathname: 'pathname',
    }),
    NavLink: ({ ...params }: NavLinkProps) => params.children,
  };
});
