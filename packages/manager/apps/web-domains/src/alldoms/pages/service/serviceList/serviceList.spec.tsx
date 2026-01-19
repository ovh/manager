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

vi.mock('@/alldoms/hooks/data/useGetServices', () => ({
  useGetServices: vi.fn(),
}));

describe('AllDom datagrid', () => {
  it('display the datagrid data', async () => {
    (useResourcesIcebergV2 as Mock).mockReturnValue({
      flattenData: [alldomService],
      isLoading: false,
      search: {
        searchInput: '',
        setSearchInput: vi.fn(),
        onSearch: vi.fn(),
      },
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
        '/alldoms/alldom-french-international-example',
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
