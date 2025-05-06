import '@/alldoms/setupTests';
import { useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import React from 'react';
import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import ServiceList from './serviceList';
import { wrapper } from '@/alldoms/utils/test.provider';
import { serviceInfoDetail } from '@/alldoms/__mocks__/serviceInfoDetail';
import { useGetDatagridServiceInfoList } from '@/alldoms/hooks/data/useDatagridServiceInfoList';

vi.mock('@/alldoms/hooks/data/useDatagridServiceInfoList', () => ({
  useGetDatagridServiceInfoList: vi.fn(),
}));

describe('AllDom datagrid', () => {
  it('displays loading spinner while main request are loading', async () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      allDomList: [],
    });

    (useGetDatagridServiceInfoList as jest.Mock).mockReturnValue({
      serviceInfoList: [],
      listLoading: true,
    });

    const { getByTestId } = render(<ServiceList />, { wrapper });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('display the datagrid data', async () => {
    (useGetDatagridServiceInfoList as jest.Mock).mockReturnValue({
      serviceInfoList: serviceInfoDetail,
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

      const status = getByTestId('status');
      expect(status).toBeInTheDocument();
      expect(status).toHaveAttribute('color', 'success');
      expect(status).toHaveAttribute('label', 'allDom_table_status_automatic');
    });
  });
});
