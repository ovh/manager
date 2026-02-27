import React from 'react';

import { RegionCard } from '../RegionCard/RegionCard.component';
import './region-selector.scss';
import {
  RegionFilter,
  hasOnlyOneRegion,
  isRegionInAp,
  isRegionInCa,
  isRegionInEu,
  isRegionInUs,
} from './region-selector.utils';
import { RegionTabs } from './region-tabs.component';

export type DisabledRegion = {
  region: string;
  message: string;
};

export type RegionSelectorProps = {
  regionList: string[];
  disabledRegions?: DisabledRegion[];
  selectedRegion?: string;
  setSelectedRegion: (region?: string) => void;
};

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  regionList,
  disabledRegions = [],
  selectedRegion,
  setSelectedRegion,
}) => {
  const [currentFilter, setCurrentFilter] = React.useState(RegionFilter.all);
  return (
    <div>
      {!hasOnlyOneRegion(regionList) && (
        <RegionTabs
          regionList={regionList}
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
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
