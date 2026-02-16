import '@/common/setupTests';
import React from 'react';
import { Mock, vi } from 'vitest';
import { fireEvent, waitFor, act } from '@/common/utils/test.provider';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import ServiceList from './serviceList';
import { wrapper, render, screen } from '@/common/utils/test.provider';
import { useGetServices } from '@/alldoms/hooks/data/useGetServices';
import { serviceInfo } from '@/alldoms/__mocks__/serviceInfo';
import { alldomService } from '@/alldoms/__mocks__/alldomService';
import { IcebergFetchResultV2 } from '@ovh-ux/manager-core-api';
import { FetchNextPageOptions, InfiniteQueryObserverResult, InfiniteData, FetchPreviousPageOptions, RefetchOptions, QueryObserverResult } from '@tanstack/react-query';

vi.mock('@/alldoms/hooks/data/useGetServices', () => ({
  useGetServices: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    useResourcesIcebergV2: vi.fn(),
  };
});

describe('AllDom datagrid', () => {
  it('display the datagrid data', async () => {
    vi.mocked(useResourcesIcebergV2).mockReturnValue({
      flattenData: [alldomService],
      isLoading: false,
      search: {
        searchInput: '',
        setSearchInput: vi.fn(),
        onSearch: vi.fn(),
      },
      setSorting: undefined,
      sorting: undefined,
      filters: undefined,
      data: undefined,
      error: undefined,
      isError: false,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      isPlaceholderData: false,
      status: 'success',
      fetchNextPage: vi.fn(),
      fetchPreviousPage: vi.fn(),
      hasNextPage: false,
      hasPreviousPage: false,
      isFetchNextPageError: false,
      isFetchingNextPage: false,
      isFetchPreviousPageError: false,
      isFetchingPreviousPage: false,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: undefined,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isRefetching: false,
      isStale: false,
      isEnabled: true,
      refetch: vi.fn(),
      fetchStatus: 'idle',
      promise: undefined
    });

    (useGetServices as Mock).mockReturnValue({
      data: [serviceInfo],
      listLoading: false,
    });
    const { getByTestId } = render(<ServiceList />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('datagrid')).toBeInTheDocument();

      const serviceName = getByTestId('alldom-french-international-example');
      expect(serviceName).toBeInTheDocument();
      expect(serviceName).toHaveAttribute(
        'href',
        'https://ovh.test/#/web-domains/alldoms/alldom-french-international-example',
      );

      const status = getByTestId('status');
      expect(status).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('navigation-action-trigger-action'));
    });

    await waitFor(() => {
      const renewAction = screen.getByTestId('renew-button');
      expect(renewAction).toBeInTheDocument();
      expect(renewAction).toHaveAttribute(
        'href',
        'https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser=alldom-french-international-example',
      );

      const handleButtonAction = screen.getByTestId('handleContact-button');
      expect(handleButtonAction).toBeInTheDocument();
      expect(handleButtonAction).toHaveAttribute(
        'href',
        'https://ovh.test/#/account/contacts/services/edit',
      );
    });
  });
});
