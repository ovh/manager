import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAllowedVrackList } from './useAllowedVrackList';
import { getVrackList, getVrackAllowedServices } from '../index';
import { vrackListMocks } from '../mocks';

vi.mock('../index', () => ({
  getVrackList: vi.fn(),
  getVrackAllowedServices: vi.fn(),
}));

const queryClient = new QueryClient();

const TestComponent = ({ vrackServicesId }: { vrackServicesId?: string }) => {
  const result = useAllowedVrackList(vrackServicesId);
  return <div>{JSON.stringify(result)}</div>;
};

describe('useAllowedVrackList', () => {
  it('should return allowed vRack list when vrackServicesId is provided and queries succeed', async () => {
    const mockVrackListResponse = vrackListMocks;
    const mockAllowedServicesResponse = {
      data: {
        vrackServices: vrackListMocks,
        cloudProject: [],
        dedicatedCloud: [],
        dedicatedCloudDatacenter: [],
        dedicatedConnect: [],
        dedicatedServer: [],
        dedicatedServerInterface: [],
        ip: [],
        ipLoadbalancing: [],
        legacyVrack: [],
        ovhCloudConnect: [],
      },
      status: 0,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    vi.mocked(getVrackList).mockResolvedValue({
      data: mockVrackListResponse,
      status: 0,
      statusText: '',
      headers: undefined,
      config: undefined,
    });
    vi.mocked(getVrackAllowedServices).mockResolvedValue(
      mockAllowedServicesResponse,
    );

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent vrackServicesId="test-id" />
      </QueryClientProvider>,
    );

    await waitFor(() =>
      screen.getByText(
        JSON.stringify({
          allowedVrackList: vrackListMocks[0],
          isLoading: false,
          isError: false,
          error: null,
          vrackListInError: [],
        }),
      ),
    );

    expect(getVrackList).toHaveBeenCalled();
    expect(getVrackAllowedServices).toHaveBeenCalled();
  });

  it('should handle errors correctly', async () => {
    const mockVrackListResponse = vrackListMocks;
    const mockAllowedServicesResponse = {
      data: {
        vrackServices: [],
        cloudProject: [],
        dedicatedCloud: [],
        dedicatedCloudDatacenter: [],
        dedicatedConnect: [],
        dedicatedServer: [],
        dedicatedServerInterface: [],
        ip: [],
        ipLoadbalancing: [],
        legacyVrack: [],
        ovhCloudConnect: [],
      },
      status: 0,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    vi.mocked(getVrackList).mockResolvedValue({
      data: mockVrackListResponse,
      status: 0,
      statusText: '',
      headers: undefined,
      config: undefined,
    });
    vi.mocked(getVrackAllowedServices).mockResolvedValue(
      mockAllowedServicesResponse,
    );

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent vrackServicesId="test-id" />
      </QueryClientProvider>,
    );

    await waitFor(() =>
      screen.getByText(
        JSON.stringify({
          allowedVrackList: [],
          isLoading: false,
          isError: false,
          error: null,
          vrackListInError: [],
        }),
      ),
    );

    expect(getVrackList).toHaveBeenCalled();
    expect(getVrackAllowedServices).toHaveBeenCalled();
  });

  it('should not call queries if no vrackServicesId is provided', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>,
    );

    await waitFor(() =>
      screen.getByText(
        JSON.stringify({
          allowedVrackList: [],
          isLoading: false,
          isError: false,
          error: null,
          vrackListInError: [],
        }),
      ),
    );

    expect(getVrackList).not.toHaveBeenCalled();
    expect(getVrackAllowedServices).not.toHaveBeenCalled();
  });

  it('should show loading state when data is loading', async () => {
    const mockVrackListResponse = vrackListMocks;

    vi.mocked(getVrackList).mockResolvedValue({
      data: mockVrackListResponse,
      status: 0,
      statusText: '',
      headers: undefined,
      config: undefined,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent vrackServicesId="test-id" />
      </QueryClientProvider>,
    );

    expect(
      screen.getByText(
        JSON.stringify({
          isLoading: true,
          isError: false,
          allowedVrackList: [],
          error: null,
          vrackListInError: [],
        }),
      ),
    ).toBeInTheDocument();
  });
});
