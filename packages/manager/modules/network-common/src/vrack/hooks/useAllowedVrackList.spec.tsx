import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAllowedVrackList } from './useAllowedVrackList';
import { getVrackList, getVrackAllowedServices } from '../api';
import { vrackListMocks } from '../../mocks';
import '@testing-library/jest-dom';

vi.mock('../api', async () => {
  const actual = await vi.importActual<typeof import('../api')>('../api');
  return {
    ...actual,
    getVrackList: vi.fn(),
    getVrackAllowedServices: vi.fn(),
  };
});

const queryClient = new QueryClient();

const TestComponent = ({ vrackServicesId }: { vrackServicesId?: string }) => {
  const result = useAllowedVrackList(vrackServicesId);
  return <div>{JSON.stringify(result)}</div>;
};

describe('useAllowedVrackList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    queryClient.clear();
  });

  test('should return allowed vRack list when vrackServicesId is provided and queries succeed', async () => {
    vi.mocked(getVrackList).mockResolvedValue({
      data: vrackListMocks,
      status: 0,
      statusText: '',
      headers: undefined,
      config: undefined,
    });
    vi.mocked(getVrackAllowedServices).mockImplementation(() => {
      return Promise.resolve({
        data: {
          vrackServices: ['test-id'],
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
      });
    });

    await render(
      <QueryClientProvider client={queryClient}>
        <TestComponent vrackServicesId="test-id" />
      </QueryClientProvider>,
    );

    await waitFor(async () => {
      await screen.findByText(/pn-00001/);
    });

    expect(getVrackList).toHaveBeenCalled();
    expect(getVrackAllowedServices).toHaveBeenCalled();
  });

  test('should handle errors correctly', async () => {
    vi.mocked(getVrackList).mockRejectedValue(new Error('net work error'));
    await render(
      <QueryClientProvider client={queryClient}>
        <TestComponent vrackServicesId="test-id" />
      </QueryClientProvider>,
    );

    vi.mocked(getVrackList).mockResolvedValue({
      data: vrackListMocks,
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    });

    expect(getVrackList).toHaveBeenCalled();
    expect(getVrackAllowedServices).not.toHaveBeenCalled();
  });
  it('should not call queries if no vrackServicesId is provided', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>,
    );

    await waitFor(async () => {
      await screen.findByText(/"allowedVrackList":\[\]/);
    });

    expect(getVrackList).not.toHaveBeenCalled();
    expect(getVrackAllowedServices).not.toHaveBeenCalled();
  });

  it('should show loading state when data is loading', async () => {
    vi.mocked(getVrackList).mockResolvedValue({
      data: vrackListMocks,
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
          allowedVrackList: [],
          isLoading: true,
          isError: false,
          error: null,
          vrackListInError: [],
        }),
      ),
    ).toBeInTheDocument();
  });
});
