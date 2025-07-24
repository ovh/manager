import '@/domain/setupTests';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ServiceList from './serviceList';
import { wrapper } from '@/domain/utils/test.provider';
import { serviceList } from '@/domain/__mocks__/serviceList';

describe('Domains datagrid', () => {
  it('displays loading spinner while main request are loading', async () => {
    (useResourcesIcebergV2 as jest.Mock).mockReturnValue({
      flattenData: [],
      isLoading: true,
    });

    const { getAllByTestId } = render(<ServiceList />, { wrapper });
    expect(getAllByTestId('loading-row').length).toBe(5);
  });

  it('display the datagrid data', async () => {
    (useResourcesIcebergV2 as jest.Mock).mockReturnValue({
      flattenData: serviceList,
      isLoading: false,
    });

    const { getByTestId } = render(<ServiceList />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('datagrid')).toBeInTheDocument();

      const serviceName = getByTestId('example.com');
      expect(serviceName).toBeInTheDocument();
      expect(serviceName).toHaveAttribute(
        'href',
        'https://ovh.test/#/web-domains/domain/example.com/information',
      );
    });
  });
});
