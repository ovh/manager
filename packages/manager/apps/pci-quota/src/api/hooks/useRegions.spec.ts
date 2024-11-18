import {
  getProjectRegions,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { TRegion } from '@ovh-ux/manager-pci-common';
import { useAvailableLocations, useLocations } from './useRegions';
import { getAvailableRegions } from '../data/region';
import { wrapper } from '@/wrapperRenders';

vi.mock('../data/region', () => ({
  getAvailableRegions: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', async () => ({
  getProjectRegions: vi.fn(),
  useTranslatedMicroRegions: vi.fn(),
}));

describe('useLocations', () => {
  const projectId = 'test-project-id';

  beforeEach(() => {
    vi.mocked(useTranslatedMicroRegions).mockReturnValue({
      translateContinentRegion: (region: string) => `continent-${region}`,
      translateMacroRegion: (region: string) => `macro-${region}`,
    } as never);
  });

  it('should return available locations data when onlyAvailable is true', async () => {
    const availableRegions = [{ name: 'region3' }, { name: 'region4' }];

    vi.mocked(getAvailableRegions).mockResolvedValue(
      (availableRegions as unknown) as TRegion[],
    );

    const { result } = renderHook(() => useAvailableLocations(projectId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data).toEqual([
      {
        name: 'macro-region3',
        continent: 'continent-region3',
        regions: ['region3'],
      },
      {
        name: 'macro-region4',
        continent: 'continent-region4',
        regions: ['region4'],
      },
    ]);
  });

  it('should handle empty regions', async () => {
    vi.mocked(getProjectRegions).mockResolvedValue([]);

    const { result } = renderHook(() => useLocations(projectId), { wrapper });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data).toEqual([]);
  });
});
