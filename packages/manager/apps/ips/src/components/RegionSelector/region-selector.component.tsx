import React from 'react';
import { useTranslation } from 'react-i18next';
import { RegionTabs } from './region-tabs.component';
import {
  RegionFilter,
  hasOnlyOneRegion,
  isRegionInCa,
  isRegionInEu,
  isRegionInUs,
  isRegionInAp,
} from './region-selector.utils';
import './region-selector.scss';
import { RegionCard } from '../RegionCard/RegionCard.component';

export type DisabledRegion = {
  region: string;
  message: string;
};

export type RegionSelectorProps = {
  regionList: string[];
  disabledRegions?: DisabledRegion[];
  selectedRegion?: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
};

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  regionList,
  disabledRegions = [],
  selectedRegion,
  setSelectedRegion,
}) => {
  const [currentFilter, setCurrentFilter] = React.useState(RegionFilter.all);
  const { t } = useTranslation('region-selector');
  return (
    <div>
      {!hasOnlyOneRegion(regionList) && (
        <RegionTabs
          regionList={regionList}
          currentFilter={currentFilter}
          removeFilter={() => setCurrentFilter(RegionFilter.all)}
          setCaFilter={() => setCurrentFilter(RegionFilter.ca)}
          setEuFilter={() => setCurrentFilter(RegionFilter.eu)}
          setUsFilter={() => setCurrentFilter(RegionFilter.us)}
          setApFilter={() => setCurrentFilter(RegionFilter.ap)}
        />
      )}
      <div className="flex flex-wrap gap-4">
        {regionList
          .filter((region) => {
            switch (currentFilter) {
              case RegionFilter.eu:
                return isRegionInEu(region);
              case RegionFilter.ca:
                return isRegionInCa(region);
              case RegionFilter.us:
                return isRegionInUs(region);
              case RegionFilter.ap:
                return isRegionInAp(region);
              case RegionFilter.all:
              default:
                return true;
            }
          })
          .map((region) => {
            const disabledMessage = disabledRegions.find(
              (item) => item.region === region,
            )?.message;
            const isSelected = selectedRegion === region && !disabledMessage;

            return (
              <RegionCard
                key={region}
                region={region}
                disabledMessage={disabledMessage}
                isSelected={isSelected}
                onClick={() => !disabledMessage && setSelectedRegion(region)}
              />
            );
          })}
      </div>
    </div>
  );
};

export default RegionSelector;
