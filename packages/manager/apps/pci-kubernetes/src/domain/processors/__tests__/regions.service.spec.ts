import { TMacroRegion } from '@/domain/entities/regions';

import { filterMacroRegionsByKubeRegions } from '../regions.service';

describe('filterMacroRegionsByKubeRegions', () => {
  const createMockMacroRegion = (name: string, microRegionIds: string[]): TMacroRegion => ({
    name,
    countryCode: 'fr',
    continentCode: 'EU',
    microRegionIds,
    plans: ['mks.free.hour.consumption'],
    enabled: true,
  });

  it('returns regions unchanged when kubeRegions is undefined', () => {
    const regions: TMacroRegion[] = [
      createMockMacroRegion('GRA', ['GRA9', 'GRA11']),
      createMockMacroRegion('SBG', ['SBG5']),
    ];

    const filter = filterMacroRegionsByKubeRegions(undefined);
    const result = filter(regions);

    expect(result).toEqual(regions);
  });

  it('filters micro regions according to kubeRegions', () => {
    const regions: TMacroRegion[] = [
      createMockMacroRegion('GRA', ['GRA9', 'GRA11', 'GRA12']),
      createMockMacroRegion('SBG', ['SBG5', 'SBG6']),
    ];

    const filter = filterMacroRegionsByKubeRegions(['GRA9', 'GRA11', 'SBG5']);
    const result = filter(regions);

    expect(result).toHaveLength(2);
    expect(result?.[0]?.microRegionIds).toEqual(['GRA9', 'GRA11']);
    expect(result?.[1]?.microRegionIds).toEqual(['SBG5']);
  });

  it('excludes macro regions with no micro regions after filtering', () => {
    const regions: TMacroRegion[] = [
      createMockMacroRegion('GRA', ['GRA9', 'GRA11']),
      createMockMacroRegion('SBG', ['SBG5']),
      createMockMacroRegion('BHS', ['BHS3']),
    ];

    const filter = filterMacroRegionsByKubeRegions(['GRA9', 'SBG5']);
    const result = filter(regions);

    expect(result).toHaveLength(2);
    expect(result?.map((r) => r.name)).toEqual(['GRA', 'SBG']);
  });

  it('handles empty kubeRegions array', () => {
    const regions: TMacroRegion[] = [createMockMacroRegion('GRA', ['GRA9'])];

    const filter = filterMacroRegionsByKubeRegions([]);
    const result = filter(regions);

    expect(result).toHaveLength(0);
  });
});
