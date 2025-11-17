import { PropsWithChildren } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { describe, it, vi } from 'vitest';

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import * as MRC from '@ovh-ux/manager-react-components';

import { useDetailsRedirection } from '@/hooks/redirection/useDetailsRedirection';

vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(() => [
    new URLSearchParams({ snapshotId: 'test-snapshot-id' }),
  ]),
}));
vi.mock('@ovh-ux/manager-gcj-module', () => ({
  Procedures: { INDIA: 'identity-documents' },
  useProcedureStatus: vi.fn((_, { enabled }) => ({
    data: enabled ? { status: 'required', ticketId: undefined } : undefined,
    isLoading: false,
  })),
  ProcedureStatus: { Open: 'open', Required: 'required' },
}));
vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: vi.fn(),
}));
vi.mock('@/data/api/applications', () => ({
  getApplications: vi.fn(() => ({
    account: { publicURL: 'https://manager.com/#/account' },
    hub: { publicURL: 'https://manager.com/#/hub' },
  })),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useDetailsRedirection', () => {
  it('returns hub url if there is no query param and user is not eligible to KYC india', async () => {
    vi.mocked(ReactRouterDom.useSearchParams).mockReturnValue([
      new URLSearchParams(),
      vi.fn(),
    ]);
    vi.mocked(MRC.useFeatureAvailability).mockReturnValue({
      data: {
        'identity-documents': false,
      },
      isLoading: false,
    } as unknown as MRC.UseFeatureAvailabilityResult<Record<string, boolean>>);

    const { result } = renderHook(() => useDetailsRedirection(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current?.url).toEqual('https://manager.com/#/hub');
    });
  });

  it('returns query params url if there is one and user is not eligible to KYC india', async () => {
    const queryParamsUrl = 'https://www.ovh.com/auth/signup';
    vi.mocked(ReactRouterDom.useSearchParams).mockReturnValue([
      new URLSearchParams({
        onsuccess: queryParamsUrl,
      }),
      vi.fn(),
    ]);
    vi.mocked(MRC.useFeatureAvailability).mockReturnValue({
      data: {
        'identity-documents': false,
      },
      isLoading: false,
    } as unknown as MRC.UseFeatureAvailabilityResult<Record<string, boolean>>);

    const { result } = renderHook(() => useDetailsRedirection(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current?.url).toEqual(queryParamsUrl);
    });
  });

  it('returns KYC India url if user is eligible to KYC india', async () => {
    vi.mocked(ReactRouterDom.useSearchParams).mockReturnValue([
      new URLSearchParams(),
      vi.fn(),
    ]);
    vi.mocked(MRC.useFeatureAvailability).mockReturnValue({
      data: {
        'identity-documents': true,
      },
      isLoading: false,
    } as unknown as MRC.UseFeatureAvailabilityResult<Record<string, boolean>>);

    const { result } = renderHook(() => useDetailsRedirection(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current?.url).toEqual('https://manager.com/#/account/identity-documents');
    });
  });
});
