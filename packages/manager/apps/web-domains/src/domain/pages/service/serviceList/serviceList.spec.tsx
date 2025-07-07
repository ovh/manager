import '@/domain/setupTests';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ServiceList from './serviceList';
import { wrapper } from '@/domain/utils/test.provider';
import { useGetDatagridServiceInfoList } from '@/alldoms/hooks/data/useGetDatagridServiceInfoList';
import { serviceList } from '@/domain/__mocks__/serviceList';

describe('Domains datagrid', () => {
  it('displays loading spinner while main request are loading', async () => {
    (useResourcesIcebergV2 as jest.Mock).mockReturnValue({
      domainList: [],
      listLoading: true,
    });

    const { getByTestId } = render(<ServiceList />, { wrapper });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('display the datagrid data', async () => {
    (useGetDatagridServiceInfoList as jest.Mock).mockReturnValue({
      data: [serviceList],
      listLoading: false,
    });
    const { getByTestId } = render(<ServiceList />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('datagrid')).toBeInTheDocument();

      const serviceName = getByTestId('test.fr');
      expect(serviceName).toBeInTheDocument();
      expect(serviceName).toHaveAttribute(
        'href',
        'https://ovh.test/#/web-domains/domain/test.fr/information',
      );
    });
  });
});
