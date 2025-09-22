import { useCallback, useMemo, useState } from 'react';

import { useProjectLocalisation } from '@/api/hooks/useRegions';
import { TLocation } from '@/types/region';

export type TRegionSelectorArgs = {
  projectId: string;
  onSelectRegion: (region: TLocation | null) => void;
  regionFilter?: (region: TLocation) => boolean;
};

const WORLD = 'WORLD';

export function useRegionSelector({
  projectId,
  onSelectRegion,
  regionFilter,
}: Readonly<TRegionSelectorArgs>) {
  const [selectedContinent, setSelectedContinent] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedMacroRegion, setSelectedMacroRegion] = useState<string | null>(null);
  const [selectedMicroRegion, setSelectedMicroRegion] = useState<string | null>(null);
  const { localisationData: query, isPending } = useProjectLocalisation(projectId, 'kubernetes');
  const { continents: unfilteredContinents, regions: unfilteredRegions } = query || {};
  const regions = unfilteredRegions?.filter((region) =>
    regionFilter ? regionFilter(region) : true,
  );

  const continents = unfilteredContinents?.filter(
    (continent) =>
      continent.id === WORLD ||
      regions?.some(({ continentLabel }) => continentLabel === continent.name),
  );

  // filter regions by selected continent
  const continentRegions = useMemo(
    () =>
      (selectedContinent?.id === WORLD
        ? regions
        : regions?.filter(({ continentLabel }) => continentLabel === selectedContinent?.name)) ||
      [],
    [selectedContinent, regions],
  );

  // list of displayed macro regions
  const macroRegions = useMemo(
    () =>
      continentRegions.filter((region) => {
        const children = continentRegions.filter(
          ({ macro, isMacro }) => macro === region.macro && isMacro === false,
        );
        // only display macro regions with one or more micro regions
        // otherwise only display the micro region
        if (region.isMacro) {
          return children.length > 1;
        }
        return children.length === 1;
      }),
    [continentRegions],
  );

  const filterMicrosRegions = useCallback(
    (region: TLocation) =>
      continentRegions.filter(
        (_region) =>
          _region.macro === region?.macro && _region?.isMacro === false && _region !== region,
      ),
    [continentRegions],
  );

  const selectMacroRegion = (region: TLocation) => {
    const micros = filterMicrosRegions(region);
    setSelectedMacroRegion(region.name);
    setSelectedMicroRegion(null);
    onSelectRegion(micros.length === 0 ? region : null);
  };

  const selectMicroRegion = (region: TLocation) => {
    setSelectedMicroRegion(region.name);
    onSelectRegion(region);
  };

  // list of displayed micro regions
  const microRegions = useMemo(() => {
    const actualRegions = macroRegions.find((region) => region.name === selectedMacroRegion);
    return actualRegions ? filterMicrosRegions(actualRegions) : [];
  }, [macroRegions, selectedMacroRegion]);

  const selectedRegionIsDisabled = useMemo(
    () =>
      [selectedMacroRegion, selectedMicroRegion].some((name) => {
        const r = [...macroRegions, ...microRegions].find((region) => region.name === name);
        return r?.enabled === false;
      }),
    [macroRegions, microRegions, selectedMacroRegion, selectedMicroRegion],
  );

  return {
    ...query,
    isPending,
    selectedRegionIsDisabled,
    regions,
    continents,
    macroRegions,
    microRegions,
    selectContinent: setSelectedContinent,
    selectMacroRegion,
    selectMicroRegion,
    selectedMacroRegion,
    selectedMicroRegion,
  };
}
