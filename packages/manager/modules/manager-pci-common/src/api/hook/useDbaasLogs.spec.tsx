import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import * as ApiDbaasLogsModule from '@/api/data/dbaas-logs';
import {
  TDbaasLog,
  TDbaasStream,
  TRetention,
  TStreamURL,
  TSubscription,
} from '@/api/data/dbaas-logs';
import {
  useAllStreamIds,
  useLogs,
  useRetention,
  useStream,
  useStreams,
  useStreamURL,
  useSubscriptions,
} from './useDbaasLogs';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useLogs', () => {
  it('fetches logs successfully', async () => {
    const mockData = ([
      { id: 'log1', serviceName: 'service1' },
    ] as unknown) as TDbaasLog[];
    vi.spyOn(ApiDbaasLogsModule, 'getLogs').mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useLogs(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});

describe('useStream', () => {
  it('fetches stream successfully', async () => {
    const mockData = ({
      id: 'stream1',
      name: 'Stream 1',
    } as unknown) as TDbaasStream;
    vi.spyOn(ApiDbaasLogsModule, 'getStream').mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useStream('service1', 'stream1'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});

describe('useStreams', () => {
  it('fetches streams successfully', async () => {
    const mockData = {
      data: ([
        { id: 'stream1', name: 'Stream 1' },
      ] as unknown) as TDbaasStream[],
      totalCount: 1,
    };
    vi.spyOn(ApiDbaasLogsModule, 'getStreams').mockResolvedValueOnce(mockData);
    const { result } = renderHook(
      () => useStreams('service1', { pageIndex: 1, pageSize: 10 }, []),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});

describe('useAllStreamIds', () => {
  it('fetches all stream ids successfully', async () => {
    const mockLogs = [{ serviceName: 'service1' }] as TDbaasLog[];
    const mockStream = ({ id: 'stream1' } as unknown) as TDbaasStream;
    vi.spyOn(ApiDbaasLogsModule, 'getLogs').mockResolvedValueOnce(mockLogs);
    vi.spyOn(ApiDbaasLogsModule, 'getStreamsIds').mockResolvedValueOnce(
      mockStream,
    );
    const { result } = renderHook(() => useAllStreamIds(), { wrapper });
    await waitFor(() => expect(result.current.data).toEqual([mockStream]));
  });
});

describe('useStreamURL', () => {
  it('fetches stream URL successfully', async () => {
    const mockData: TStreamURL[] = [
      {
        address: 'https://logs.ovh.com/stream',
        type: 'http',
      },
    ];
    vi.spyOn(ApiDbaasLogsModule, 'getStreamURL').mockResolvedValueOnce(
      mockData,
    );
    const { result } = renderHook(() => useStreamURL('service1', 'stream1'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});

describe('useRetention', () => {
  it('fetches retention successfully', async () => {
    const mockData = ({
      id: 'retention1',
      duration: 30,
    } as unknown) as TRetention;
    vi.spyOn(ApiDbaasLogsModule, 'getRetention').mockResolvedValueOnce(
      mockData,
    );
    const { result } = renderHook(
      () => useRetention('service1', 'cluster1', 'retention1'),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});

describe('useSubscriptions', () => {
  it('fetches subscriptions successfully', async () => {
    const mockData = ([
      { id: 'subscription1', name: 'Subscription 1' },
    ] as unknown) as TSubscription[];
    vi.spyOn(ApiDbaasLogsModule, 'getSubscriptions').mockResolvedValueOnce(
      mockData,
    );
    const { result } = renderHook(
      () => useSubscriptions('service1', 'stream1'),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});
