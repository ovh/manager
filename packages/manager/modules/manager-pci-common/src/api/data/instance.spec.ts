import { describe, expect, it, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getInstance, getInstances } from './instance';

describe('getInstance', () => {
  it('returns instance data successfully', async () => {
    const mockData = {
      created: '2023-01-01T00:00:00Z',
      flavorId: 'flavor1',
      id: 'instance1',
      imageId: 'image1',
      ipAddresses: [
        {
          ip: '192.168.0.1',
          networkId: 'network1',
          type: 'public',
          version: 4,
        },
      ],
      name: 'Instance 1',
      operationIds: ['op1'],
      planCode: 'plan1',
      region: 'region1',
      status: 'ACTIVE',
    };
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });
    const result = await getInstance('projectId', 'instance1');
    expect(result).toEqual(mockData);
  });

  it('throws an error when API call fails', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));
    await expect(getInstance('projectId', 'instance1')).rejects.toThrow(
      errorMessage,
    );
  });
});

describe('getInstances', () => {
  it('returns instances data successfully', async () => {
    const mockData = [
      {
        created: '2023-01-01T00:00:00Z',
        flavorId: 'flavor1',
        id: 'instance1',
        imageId: 'image1',
        ipAddresses: [
          {
            ip: '192.168.0.1',
            networkId: 'network1',
            type: 'public',
            version: 4,
          },
        ],
        name: 'Instance 1',
        operationIds: ['op1'],
        planCode: 'plan1',
        region: 'region1',
        status: 'ACTIVE',
      },
    ];
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });
    const result = await getInstances('projectId');
    expect(result).toEqual(mockData);
  });

  it('returns instances data filtered by region successfully', async () => {
    const mockData = [
      {
        created: '2023-01-01T00:00:00Z',
        flavorId: 'flavor1',
        id: 'instance1',
        imageId: 'image1',
        ipAddresses: [
          {
            ip: '192.168.0.1',
            networkId: 'network1',
            type: 'public',
            version: 4,
          },
        ],
        name: 'Instance 1',
        operationIds: ['op1'],
        planCode: 'plan1',
        region: 'region1',
        status: 'ACTIVE',
      },
    ];
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });
    const result = await getInstances('projectId', 'region1');
    expect(result).toEqual(mockData);
  });

  it('throws an error when API call fails', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));
    await expect(getInstances('projectId')).rejects.toThrow(errorMessage);
  });

  it('returns empty array when no instances are available', async () => {
    const mockData = [];
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });
    const result = await getInstances('projectId');
    expect(result).toEqual(mockData);
  });
});
