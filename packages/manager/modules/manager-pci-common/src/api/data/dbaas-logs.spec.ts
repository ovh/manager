import {
  fetchIcebergV6,
  Filter,
  IcebergFetchResultV6,
  v6,
} from '@ovh-ux/manager-core-api';
import { describe, it, vi } from 'vitest';
import {
  getLogs,
  getRetention,
  getStream,
  getStreams,
  getStreamsIds,
  getStreamURL,
  getSubscriptions,
} from './dbaas-logs';

describe('dbaas-logs', () => {
  it('fetches logs successfully', async () => {
    const mockData = [{ serviceName: 'log1' }];
    vi.mocked(fetchIcebergV6).mockResolvedValue({
      data: mockData,
    } as IcebergFetchResultV6<unknown>);
    const result = await getLogs();
    expect(result).toEqual(mockData);
  });

  it('fetches stream by service name and stream id', async () => {
    const mockData = { streamId: 'stream1' };
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getStream('service1', 'stream1');
    expect(result).toEqual(mockData);
  });

  it('fetches stream ids by service name', async () => {
    const mockData = [{ streamId: 'stream1' }];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getStreamsIds('service1');
    expect(result).toEqual(mockData);
  });

  it('fetches streams with pagination and filters', async () => {
    const mockData = [{ streamId: 'stream1' }];
    const mockTotalCount = 1;
    vi.mocked(fetchIcebergV6).mockResolvedValue({
      data: mockData,
      totalCount: mockTotalCount,
    } as IcebergFetchResultV6<unknown>);
    const pagination = { pageIndex: 1, pageSize: 10 };
    const filters = ([
      { field: 'name', comparator: 'eq', value: 'test' },
    ] as unknown) as Filter[];
    const result = await getStreams('service1', pagination, filters);
    expect(result).toEqual({ data: mockData, totalCount: mockTotalCount });
  });

  it('fetches stream URL by service name and stream id', async () => {
    const mockData = [{ address: 'http://example.com', type: 'http' }];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getStreamURL('service1', 'stream1');
    expect(result).toEqual(mockData);
  });

  it('fetches retention by service name, cluster id, and retention id', async () => {
    const mockData = { retentionId: 'retention1' };
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getRetention('service1', 'cluster1', 'retention1');
    expect(result).toEqual(mockData);
  });

  it('fetches subscriptions by service name and stream id', async () => {
    const mockData = [{ subscriptionId: 'subscription1' }];
    vi.mocked(fetchIcebergV6).mockResolvedValue({
      data: mockData,
    } as IcebergFetchResultV6<unknown>);
    const result = await getSubscriptions('service1', 'stream1');
    expect(result).toEqual(mockData);
  });
});
