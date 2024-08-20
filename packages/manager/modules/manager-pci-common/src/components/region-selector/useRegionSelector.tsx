import { useMemo, useState } from 'react';
import { TLocalisation, useProjectLocalisation } from './useRegions';

interface RegionSelectorProps {
  projectId: string;
  onSelectRegion: (region: TLocalisation) => void;
  regionFilter?: (region: TLocalisation) => boolean;
}

export function useRegionSelector({
  projectId,
  onSelectRegion,
  regionFilter,
}: Readonly<RegionSelectorProps>) {
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [selectedMacroRegion, setSelectedMacroRegion] = useState(null);
  const [selectedMicroRegion, setSelectedMicroRegion] = useState(null);
  const query = useProjectLocalisation(projectId);
  const { continents: unfilteredContinents, regions: unfilteredRegions } =
    query.data || {};
  const regions = unfilteredRegions?.filter((region) =>
    regionFilter ? regionFilter(region) : true,
  );
  const continents = unfilteredContinents?.filter(
    (continent) =>
      continent.id === 'WORLD' ||
      regions.some(({ continentLabel }) => continentLabel === continent.name),
  );

  // filter regions by selected continent
  const continentRegions = useMemo(
    () =>
      (selectedContinent?.id === 'WORLD'
        ? regions
        : regions?.filter(
            ({ continentLabel }) => continentLabel === selectedContinent?.name,
          )) || [],
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

  // list of displayed micro regions
  const microRegions = useMemo(
    () =>
      (macroRegions.indexOf(selectedMacroRegion) >= 0 &&
        continentRegions.filter(
          (region) =>
            region.macro === selectedMacroRegion.macro &&
            region.isMacro === false &&
            region !== selectedMacroRegion,
        )) ||
      [],
    [macroRegions, selectedMacroRegion],
  );

  const selectMacroRegion = (region: TLocalisation) => {
    const micros = continentRegions.filter(
      (_region) =>
        _region.macro === region.macro &&
        _region.isMacro === false &&
        _region !== region,
    );
    setSelectedMacroRegion(region);
    setSelectedMicroRegion(null);
    onSelectRegion(micros.length === 0 ? region : null);
  };

  const selectMicroRegion = (region: TLocalisation) => {
    setSelectedMicroRegion(region);
    onSelectRegion(region);
  };

  return {
    ...query,
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
