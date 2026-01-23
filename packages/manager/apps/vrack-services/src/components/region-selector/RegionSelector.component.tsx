import React from 'react';

import { useTranslation } from 'react-i18next';

import { CARD_COLOR, Card, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { TRANSLATION_NAMESPACES } from '@/utils/constants';

import {
  RegionFilter,
  getCityNameKey,
  getCountryCode,
  getCountryKey,
  hasOnlyOneRegion,
  isRegionInAp,
  isRegionInCa,
  isRegionInEu,
  isRegionInUs,
} from './RegionSelector.utils';
import { RegionTabs } from './RegionTabs.component';

export type RegionSelectorProps = {
  regionList: string[];
  selectedRegion?: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
};

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  regionList,
  selectedRegion,
  setSelectedRegion,
}) => {
  const [currentFilter, setCurrentFilter] = React.useState(RegionFilter.all);
  const { t } = useTranslation(TRANSLATION_NAMESPACES.regionSelector);
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
            const borderStyle = selectedRegion === region ? `border-2 m-0` : `m-px hover:shadow-md`;

            return (
              <Card
                key={region}
                className={`flex cursor-pointer items-center p-3 transition-shadow ${borderStyle} p-4 sm:w-60`}
                onClick={() => setSelectedRegion(region)}
                color={selectedRegion === region ? CARD_COLOR.primary : CARD_COLOR.neutral}
              >
                <span
                  style={{
                    backgroundImage: `url('flags/${getCountryCode(region)}.svg')`,
                  }}
                  className={`mr-3 h-9 w-11 bg-cover shadow-md`}
                />
                <div className="flex flex-col">
                  <Text className="block" preset={TEXT_PRESET.heading4}>
                    {t(getCountryKey(region))}
                  </Text>
                  <Text preset={TEXT_PRESET.span}>{t(getCityNameKey(region))}</Text>
                  <Text preset={TEXT_PRESET.span}>{region}</Text>
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default RegionSelector;
