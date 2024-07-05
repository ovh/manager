import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import * as API from '@/api/network';
import NetworkOptions from '@/components/Order/cluster-options/network-options';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  mockedNetworks,
  mockedSubnets,
} from '@/__tests__/helpers/mocks/network';
import { NetworkOptionValue } from '@/models/order-funnel';
import { database } from '@/models/database';
import { useGetNetwork, useGetSubnet } from '@/hooks/api/network.api.hooks';

vi.mock('@/api/network', () => ({
  networkApi: {
    getPrivateNetworks: vi.fn(),
    getSubnets: vi.fn(),
    getVrack: vi.fn(),
  },
}));

// mock useGetNetworks
vi.mocked(API.networkApi.getPrivateNetworks).mockResolvedValue(mockedNetworks);
const { result: resultNetwork } = renderHook(() => useGetNetwork('projectId'), {
  wrapper: QueryClientWrapper,
});

// mock useGetSubnets
vi.mocked(API.networkApi.getSubnets).mockResolvedValue(mockedSubnets);
const { result: resultSubnet } = renderHook(
  () => useGetSubnet('projectId', 'networkId'),
  {
    wrapper: QueryClientWrapper,
  },
);

describe('NetworkOptions component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  const networkValue: NetworkOptionValue = {
    type: database.NetworkTypeEnum.private,
  };

  it('should display the network and subnet options', async () => {
    const onChange = vi.fn();
    render(
      <NetworkOptions
        onChange={onChange}
        networks={mockedNetworks}
        subnets={mockedSubnets}
        value={networkValue}
        availableNetworks={[
          database.NetworkTypeEnum.private,
          database.NetworkTypeEnum.public,
        ]}
        networkQuery={resultNetwork.current}
        subnetQuery={resultSubnet.current}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
      expect(screen.getByTestId('network-placeholder')).toBeInTheDocument();
      expect(screen.queryByText('noNetworkFoundTitle')).not.toBeInTheDocument();
    });
  });

  it('should display an alert on no network', async () => {
    const onChange = vi.fn();
    render(
      <NetworkOptions
        onChange={onChange}
        networks={[]}
        subnets={[]}
        value={networkValue}
        availableNetworks={[
          database.NetworkTypeEnum.private,
          database.NetworkTypeEnum.public,
        ]}
        networkQuery={resultNetwork.current}
        subnetQuery={resultSubnet.current}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('noNetworkFoundTitle')).toBeInTheDocument();
    });
  });

  it('should display an alert on no private network', async () => {
    const onChange = vi.fn();
    render(
      <NetworkOptions
        onChange={onChange}
        networks={mockedNetworks}
        subnets={mockedSubnets}
        value={networkValue}
        availableNetworks={[database.NetworkTypeEnum.public]}
        networkQuery={resultNetwork.current}
        subnetQuery={resultSubnet.current}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('noPrivateNetworkOffer')).toBeInTheDocument();
    });
  });

  it('should display an alert on no subnet', async () => {
    const onChange = vi.fn();
    render(
      <NetworkOptions
        onChange={onChange}
        networks={mockedNetworks}
        subnets={[]}
        value={networkValue}
        availableNetworks={[
          database.NetworkTypeEnum.private,
          database.NetworkTypeEnum.public,
        ]}
        networkQuery={resultNetwork.current}
        subnetQuery={resultSubnet.current}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('noNetworkFoundTitle')).toBeInTheDocument();
    });
  });
});
