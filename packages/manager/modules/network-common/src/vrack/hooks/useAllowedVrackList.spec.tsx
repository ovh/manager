import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { InternalAxiosRequestConfig } from 'axios';
import { vi } from 'vitest';

import { vrackListMocks } from '../../mocks';
import { getVrackAllowedServices, getVrackList } from '../api';
import { useAllowedVrackList } from './useAllowedVrackList';

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
      headers: {},
      config: {} as InternalAxiosRequestConfig<string>,
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
        headers: {},
        config: {} as InternalAxiosRequestConfig<string>,
      });
    });

    render(
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

  test('should handle errors correctly', () => {
    vi.mocked(getVrackList).mockRejectedValue(new Error('net work error'));

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent vrackServicesId="test-id" />
      </QueryClientProvider>,
    );

    vi.mocked(getVrackList).mockResolvedValue({
      data: vrackListMocks,
      status: 200,
      statusText: '',
      headers: {},
      config: {} as InternalAxiosRequestConfig<string>,
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

  it('should show loading state when data is loading', () => {
    vi.mocked(getVrackList).mockResolvedValue({
      data: vrackListMocks,
      status: 0,
      statusText: '',
      headers: {},
      config: {} as InternalAxiosRequestConfig<string>,
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
