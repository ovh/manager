import '@/test-utils/setupUnitTests';
import React, { PropsWithChildren } from 'react';
import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { ListingContextProvider } from '@/pages/listing/listingContext';
import ipDetailsList from '../../../../../../mocks/ip/get-ip-details.json';
import { IpAttachedService, IpAttachedServiceProps } from './IpAttachedService';
import { getLinkByHref } from '@/test-utils';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({ ipDetails: undefined, isLoading: true })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpDetailsMock,
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

const shellContext = {
  environment: {
    user: { ovhSubsidiary: 'FR' },
  },
  shell: {
    tracking: {
      trackClick: vi.fn(),
      trackPage: vi.fn(),
      init: vi.fn(),
    },
    navigation: {
      getURL: vi.fn().mockResolvedValue('link-to-service'),
    },
  },
};

/** RENDER */
const renderComponent = (params: IpAttachedServiceProps) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <ListingContextProvider>
          <IpAttachedService {...params} />
        </ListingContextProvider>
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

describe('IpAttachedService Component', async () => {
  it('Should display routed service with link to service', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[3],
      isLoading: false,
    });
    const { container } = renderComponent({ ip: ipDetailsList[3].ip });
    await getLinkByHref({
      container,
      href: 'link-to-service',
      label: ipDetailsList[3].routedTo.serviceName,
    });
  });
});
