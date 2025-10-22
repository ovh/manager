import { vi } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';
import { NavLinkProps } from 'react-router-dom';
import { ListingContextType } from '@/pages/listing/listingContext';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: { language: 'fr_FR' },
  }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: vi.fn(), trackPage: vi.fn() }),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const original: typeof import('react-router-dom') = await importOriginal();
  return {
    ...original,
    useSearchParams: () => [{ get: (str: string) => str }],
    useNavigate: vi.fn(),
    useLocation: vi.fn().mockReturnValue({
      pathname: 'pathname',
    }),
    NavLink: ({ ...params }: NavLinkProps) => <>{params.children}</>,
  };
});

export const listingContextDefaultParams = {
  addExpiredIp: vi.fn(),
  expiredIps: [] as string[],
  apiFilter: {},
  setApiFilter: vi.fn(),
  hasNoApiFilter: true,
  onGoingAggregatedIps: [] as string[],
  setOnGoingAggregatedIps: vi.fn(),
  onGoingSlicedIps: [] as string[],
  setOnGoingSlicedIps: vi.fn(),
  onGoingCreatedIps: [] as string[],
  setOnGoingCreatedIps: vi.fn(),
};
