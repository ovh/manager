import React, { ComponentType } from 'react';

import { useLocation } from 'react-router-dom';

import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { deleteGitAssociation } from '@/data/api/git';
import { useGetHostingServiceWebsite } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { createWrapper, i18n } from '@/utils/test.provider';

import DeleteGitModal from '../DeleteGit.modal';

vi.mock('@ovh-ux/muk', () => ({
  useNotifications: vi.fn(() => ({
    addSuccess: vi.fn(),
    addError: vi.fn(),
    addWarning: vi.fn(),
    addInfo: vi.fn(),
  })),
}));

vi.mock('@/data/api/git', () => ({
  deleteGitAssociation: vi.fn(),
}));

vi.mock('@/data/hooks/webHostingDashboard/useWebHostingDashboard', () => ({
  useGetHostingServiceWebsite: vi.fn(),
}));

const testQueryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

const RouterWrapper = createWrapper();

const Wrappers = ({ children }: { children: React.ReactElement }) => {
  return (
    <RouterWrapper>
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    </RouterWrapper>
  );
};

describe('DeleteGitModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.skip('deletion for a website', async () => {
    vi.mocked(useLocation).mockReturnValue({
      state: { serviceName: 'test-service', path: 'test-path' },
      pathname: '/delete-git',
      search: '',
      hash: '',
      key: '',
    });

    vi.mocked(useGetHostingServiceWebsite).mockReturnValue({
      data: ['1'],
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isFetching: false,
      refetch: vi.fn(),
    } as unknown as UseQueryResult<string[], Error>);

    const { getByTestId } = render(<DeleteGitModal />, { wrapper: Wrappers as ComponentType });

    const deleteButton = getByTestId('primary-button');

    act(() => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(deleteGitAssociation).toHaveBeenCalledWith('test-service', '1', false);
    });
  });
});
