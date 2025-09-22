import { describe, it, vi } from 'vitest';

import { v6 } from '@ovh-ux/manager-core-api';

import { getFlavors, getKubeFlavors, getRegionFlavors } from './flavors';

describe('getRegionFlavors', () => {
  it('fetches region flavors successfully', async () => {
    const mockData = [{ id: 'flavor1', name: 'Flavor 1', ram: 2048, disk: 20, vcpus: 2 }];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getRegionFlavors('project1', 'region1');
    expect(result).toEqual(mockData);
  });

  it('handles empty region flavors response', async () => {
    const mockData = [];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getRegionFlavors('project1', 'region1');
    expect(result).toEqual(mockData);
  });

  it('handles error when fetching region flavors', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('Network Error'));
    await expect(getRegionFlavors('project1', 'region1')).rejects.toThrow('Network Error');
  });

  it('fetches region flavors with multiple flavors', async () => {
    const mockData = [
      { id: 'flavor1', name: 'Flavor 1', ram: 2048, disk: 20, vcpus: 2 },
      { id: 'flavor2', name: 'Flavor 2', ram: 4096, disk: 40, vcpus: 4 },
    ];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getRegionFlavors('project1', 'region1');
    expect(result).toEqual(mockData);
  });

  it('handles region flavors with missing optional fields', async () => {
    const mockData = [
      {
        id: 'flavor1',
        name: 'Flavor 1',
        ram: 2048,
        disk: 20,
        vcpus: 2,
        planCodes: {},
      },
    ];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getRegionFlavors('project1', 'region1');
    expect(result).toEqual(mockData);
  });
});

describe('getFlavors', () => {
  it('returns flavors data successfully', async () => {
    const mockData = [
      {
        available: true,
        capabilities: [{ name: 'capability1', enabled: true }],
        disk: 100,
        id: 'flavor1',
        name: 'Flavor 1',
        osType: 'linux',
        planCodes: { hourly: 'hourly1', monthly: 'monthly1' },
        quota: 10,
        ram: 4096,
        region: 'region1',
        type: 'type1',
        vcpus: 2,
        pricingsHourly: { price: 0.1 },
        pricingsMonthly: { price: 10 },
      },
    ];
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });
    const result = await getFlavors('projectId', 'region1');
    expect(result).toEqual(mockData);
  });

  it('throws an error when API call fails', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));
    await expect(getFlavors('projectId', 'region1')).rejects.toThrow(errorMessage);
  });

  it('returns empty array when no flavors are available', async () => {
    const mockData = [];
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });
    const result = await getFlavors('projectId', 'region1');
    expect(result).toEqual(mockData);
  });
});

describe('getKubeFlavors', () => {
  it('returns kube flavors data successfully', async () => {
    const mockData = [
      {
        category: 'category1',
        gpus: 1,
        name: 'Kube Flavor 1',
        ram: 8192,
        state: 'available',
        vCPUs: 4,
      },
    ];
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });
    const result = await getKubeFlavors('projectId', 'region1');
    expect(result).toEqual(mockData);
  });

  it('throws an error when API call fails', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));
    await expect(getKubeFlavors('projectId', 'region1')).rejects.toThrow(errorMessage);
  });

  it('returns empty array when no kube flavors are available', async () => {
    const mockData = [];
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });
    const result = await getKubeFlavors('projectId', 'region1');
    expect(result).toEqual(mockData);
  });
});
