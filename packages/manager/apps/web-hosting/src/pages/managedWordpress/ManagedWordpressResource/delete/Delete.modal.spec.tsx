import React, { ComponentType } from 'react';

import { useLocation, useParams } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';

import { deleteManagedCmsResourceWebsite } from '@/data/api/managedWordpress';
import { createWrapper, i18n } from '@/utils/test.provider';

import DeleteModal from './Delete.modal';

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

describe('Deletemodal Component', () => {
  it.skip('deletion for a website', async () => {
    vi.mocked(useParams).mockReturnValue({ serviceName: 'test-service' });
    vi.mocked(useLocation).mockReturnValue({
      state: { websiteIds: ['testID'] },
      pathname: '/delete',
      search: '',
      hash: '',
      key: '',
    });

    const { getByTestId } = render(<DeleteModal />, { wrapper: Wrappers as ComponentType });
    const deleteButton = getByTestId('primary-button');

    act(() => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(deleteManagedCmsResourceWebsite).toHaveBeenCalledWith('test-service', 'testID');
    });
  });
});
