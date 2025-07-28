import '@/test-utils/setupUnitTests';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { ListingContextProvider } from '@/pages/listing/listingContext';
import ipDetailsList from '../../../../../../../mocks/ip/get-ip-details.json';
import { IpActionsCell, IpActionsCellParams } from './IpActionsCell';
import { getButtonByIcon } from '@/test-utils';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({ ipDetails: undefined, isLoading: true })),
);

const useIpHasForcedMitigationMock = vi.hoisted(() =>
  vi.fn(() => ({ hasForcedMitigation: true })),
);

const useIpHasServicesAttachedMock = vi.hoisted(() =>
  vi.fn(() => ({ hasServiceAttached: true })),
);

const useIpHasServicesNotAttachedMock = vi.hoisted(() =>
  vi.fn(() => ({ hasServiceNotAttached: false })),
);

const useGetIpVmacWithIpMock = vi.hoisted(() =>
  vi.fn(() => ({ vmacsWithIp: [] })),
);

const useGetIpMitigationWithoutIcebergMock = vi.hoisted(() =>
  vi.fn(() => ({ ipMitigation: {}, isLoading: false })),
);

const useGetAttachedServicesMock = vi.hoisted(() =>
  vi.fn(() => ({ servicesAttached: [] })),
);

const useIpHasVmacMock = vi.hoisted(() =>
  vi.fn(() => ({ isVmacAlreadyExist: false })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpDetailsMock,
  useIpHasForcedMitigation: useIpHasForcedMitigationMock,
  useIpHasServicesAttached: useIpHasServicesAttachedMock,
  useIpHasServicesNotAttached: useIpHasServicesNotAttachedMock,
  useGetIpVmacWithIp: useGetIpVmacWithIpMock,
  useGetIpMitigationWithoutIceberg: useGetIpMitigationWithoutIcebergMock,
  useGetAttachedServices: useGetAttachedServicesMock,
  useIpHasVmac: useIpHasVmacMock,
}));

const mockShell = {
  navigation: {
    getURL: vi.fn().mockResolvedValue('mocked-url'),
  },
};

/** RENDER */
const renderComponent = (params: IpActionsCellParams) => {
  return render(
    <ShellContext.Provider
      value={({ shell: mockShell } as unknown) as ShellContextType}
    >
      <QueryClientProvider client={queryClient}>
        <ListingContextProvider>
          <IpActionsCell {...params} />
        </ListingContextProvider>
      </QueryClientProvider>
    </ShellContext.Provider>,
  );
};

describe('IpActionsCell Component', async () => {
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
