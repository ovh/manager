import '@/alldoms/setupTests';
import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import ServiceList from './serviceList';
import { wrapper } from '@/alldoms/utils/test.provider';
import { useGetAllDoms } from '@/alldoms/hooks/data/useGetAllDoms';
import { serviceInfoDetail } from '@/alldoms/__mocks__/serviceInfoDetail';
import { serviceInfoProperty } from '@/alldoms/__mocks__/serviceInfoProperty';

vi.mock('@/alldoms/hooks/data/useGetAllDoms', () => ({
  useGetAllDoms: vi.fn(),
}));

describe('AllDom datagrid', () => {
  it('display the datagrid data', async () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      data: serviceInfoProperty,
      isLoading: false,
    });

    (useGetAllDoms as jest.Mock).mockReturnValue({
      data: [serviceInfoDetail],
      listLoading: false,
    });
    const { getByTestId } = render(<ServiceList />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('datagrid')).toBeInTheDocument();

      const serviceName = getByTestId('testdomain');
      expect(serviceName).toBeInTheDocument();
      expect(serviceName).toHaveAttribute(
        'href',
        'https://ovh.test/#/web-domains/alldoms/testdomain',
      );

      // We test the status
      const status = getByTestId('status');
      expect(status).toBeInTheDocument();
      expect(status).toHaveAttribute('color', 'success');
      expect(status).toHaveAttribute('label', 'allDom_table_status_automatic');

      // We test the actions
      fireEvent.click(screen.getByTestId('navigation-action-trigger-action'));
      const renewAction = screen.getByTestId('renew-button');
      expect(renewAction).toBeInTheDocument();
      expect(renewAction).toHaveAttribute(
        'href',
        'https://www.ovh.com/cgi-bin/order/renew.cgi?domainChooser=testdomain',
      );

      const handleButtonAction = screen.getByTestId('handleContact-button');
      expect(handleButtonAction).toBeInTheDocument();
      expect(handleButtonAction).toHaveAttribute(
        'href',
        'https://ovh.test/#/account/contacts/services/edit?service=testdomain&categoryType=ALL_DOM',
      );
    });
  });
});
