import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import { FC, useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DeepReadonly } from '@/types/utils.type';
import {
  TRegion,
  TRegionCategory,
  TRegionEntity,
} from '@/types/catalog/entity.types';
import { TabContentWrapper } from '../../../../../components/tab/TabContentWrapper.component';
import { AvailableMacroRegions } from './AvailableMacroRegions.component';
import { AvailableMicroRegions } from './AvailableMicroRegions.component';
import { UnavailableRegions } from './UnavailableRegions.component';
import { useAppStore } from '@/store/hooks/useAppStore';

type TTabContentProps = {
  category: DeepReadonly<TRegionCategory>;
  data: TRegionEntity;
};

export const TabContent: FC<TTabContentProps> = ({ category, data }) => {
  const {
    translateMacroRegion,
    translateMicroRegion,
  } = useTranslatedMicroRegions();
  const {
    allAvailableRegions,
    availableMacroRegions,
    availableMicroRegions,
    unavailableRegions,
  } = data.regions.data;

  const { selectedRegion, setRegion } = useAppStore(
    useShallow((state) => ({
      selectedRegion: state.region(),
      setRegion: state.setRegion,
    })),
  );

  const groupRegionsByCategory = useCallback(
    (regions: DeepReadonly<TRegion[]>): DeepReadonly<TRegion[]> =>
      category.name === 'all'
        ? regions
        : regions.filter((region) => region.category === category.name),
    [category.name],
  );

  const allAvailableRegionsByCategory = groupRegionsByCategory(
    allAvailableRegions,
  );

  const availableMacroRegionsByCategory = groupRegionsByCategory(
    availableMacroRegions,
  );

  const availableMicroRegionsByCategory = groupRegionsByCategory(
    availableMicroRegions,
  );

  const unavailableRegionsByCategory = groupRegionsByCategory(
    unavailableRegions,
  );

  const selectedRegionIsMicroRegion = useMemo(
    () =>
      selectedRegion &&
      availableMicroRegionsByCategory.find(
        (elt) => elt.name === selectedRegion.name,
      ),
    [availableMicroRegionsByCategory, selectedRegion],
  );

  const handleRegionTileClick = useCallback(
    ({ name, datacenter }: TRegion) => () => {
      setRegion({ name, datacenter });
    },
    [setRegion],
  );

  const getRegionLabel = useCallback(
    (name: string, datacenter: string) => {
      const regionMicrolabel = translateMicroRegion(name);
      const regionMacrolabel = translateMacroRegion(datacenter);
      if (availableMicroRegions.some((elt) => elt.name === name)) {
        return regionMacrolabel;
      }
      return regionMicrolabel;
    },
    [availableMicroRegions, translateMacroRegion, translateMicroRegion],
  );

  return (
    <TabContentWrapper>
      <AvailableMacroRegions
        availableMacroRegions={availableMacroRegionsByCategory}
        getRegionLabel={getRegionLabel}
        selectedRegionDatacenter={selectedRegion?.datacenter}
        onRegionTileClick={handleRegionTileClick}
      />
      {selectedRegionIsMicroRegion && (
        <AvailableMicroRegions
          availableMicroRegions={availableMicroRegionsByCategory}
          onRegionTileClick={handleRegionTileClick}
          selectedRegion={selectedRegion}
        />
      )}
      {unavailableRegionsByCategory.length > 0 && (
        <UnavailableRegions
          availableRegions={allAvailableRegionsByCategory}
          unavailableRegions={unavailableRegionsByCategory}
          getRegionLabel={getRegionLabel}
        />
      )}
    </TabContentWrapper>
  );
};
