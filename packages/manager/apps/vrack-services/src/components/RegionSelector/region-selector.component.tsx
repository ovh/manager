import React from 'react';
import { CARD_COLOR, TEXT_PRESET, Card, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { RegionTabs } from './region-tabs.component';
import {
  RegionFilter,
  getCityNameKey,
  getCountryCode,
  getCountryKey,
  hasOnlyOneRegion,
  isRegionInCa,
  isRegionInEu,
  isRegionInUs,
  isRegionInAp,
  shadowColor,
} from './region-selector.utils';
import './region-selector.scss';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

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
            const borderStyle =
              selectedRegion === region
                ? `region_selector_selected`
                : `m-[1px] hover:shadow-md`;

            return (
              <Card
                key={region}
                className={`flex items-center p-3 cursor-pointer transition-shadow ${borderStyle} sm:w-[245px]`}
                onClick={() => setSelectedRegion(region)}
                color={CARD_COLOR.neutral}
              >
                <span
                  style={{
                    backgroundImage: `url('flags/${getCountryCode(
                      region,
                    )}.svg')`,
                  }}
                  className={`w-[44px] h-[32px] shadow-md shadow-[${shadowColor}] mr-3`}
                />
                <div className="flex flex-col">
                  <Text className="block" preset={TEXT_PRESET.heading4}>
                    {t(getCountryKey(region))}
                  </Text>
                  <Text preset={TEXT_PRESET.span}>
                    {t(getCityNameKey(region))}
                  </Text>
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
