import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { TAddon } from '@/pages/create/store';
import { getFlavor } from './flavors';
import { TFlavor } from '@/api/data/load-balancer';

describe('getFlavor', () => {
  const projectId = 'test-project';
  const regionName = 'test-region';
  const addon = ({
    technicalName: 'test-flavor',
    invoiceName: 'invoiceName',
  } as unknown) as TAddon;

  it('should return the correct flavor', async () => {
    const mockFlavors: TFlavor[] = [
      { name: 'test-flavor', region: 'region1', id: 'id1' },
      { name: 'another-flavor', region: 'region2', id: 'id2' },
    ];

    vi.mocked(v6.get).mockResolvedValue({ data: mockFlavors });

    const result = await getFlavor(projectId, regionName, addon);

    expect(result).toEqual(mockFlavors[0]);
  });

  it('should return undefined if the flavor is not found', async () => {
    const mockFlavors: TFlavor[] = [
      { name: 'another-flavor', region: 'value2', id: 'id2' },
    ];

    vi.mocked(v6.get).mockResolvedValue({ data: mockFlavors });

    const result = await getFlavor(projectId, regionName, addon);

    expect(result).toBeUndefined();
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('API Error'));

    await expect(getFlavor(projectId, regionName, addon)).rejects.toThrow(
      'API Error',
    );
  });
});
