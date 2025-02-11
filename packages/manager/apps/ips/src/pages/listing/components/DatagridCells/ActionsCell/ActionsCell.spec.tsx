import '@/test-utils/setupUnitTests';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ListingContextProvider } from '@/pages/listing/listingContext';
import ipDetailsList from '../../../../../../mocks/ip/get-ip-details.json';
import { ActionsCell, ActionsCellParams } from './ActionsCell';
import { getButtonByIcon } from '@/test-utils';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({ ipDetails: undefined, isLoading: true })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpDetailsMock,
}));

/** RENDER */
const renderComponent = (params: ActionsCellParams) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContextProvider>
        <ActionsCell {...params} />
      </ListingContextProvider>
    </QueryClientProvider>,
  );
};

describe('ActionsCell Component', async () => {
  it('Should display action menu', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    const { container } = renderComponent({ ip: ipDetailsList[0].ip });
    await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ellipsisVertical,
    });
  });
});
