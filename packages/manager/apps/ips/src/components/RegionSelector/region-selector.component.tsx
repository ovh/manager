import React from 'react';
import { OdsCard, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_CARD_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { RegionTabs } from './region-tabs.component';
import {
  RegionFilter,
  getCityNameKey,
  getCountryCode,
  getCountryKey,
  isRegionInCa,
  isRegionInEu,
  isRegionInUs,
  shadowColor,
} from './region-selector.utils';
import 'flag-icons/css/flag-icons.min.css';
import './region-selector.scss';

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
  const { t } = useTranslation('region-selector');
  return (
    <div>
      <RegionTabs
        regionList={regionList}
        currentFilter={currentFilter}
        removeFilter={() => setCurrentFilter(RegionFilter.all)}
        setCaFilter={() => setCurrentFilter(RegionFilter.ca)}
        setEuFilter={() => setCurrentFilter(RegionFilter.eu)}
        setUsFilter={() => setCurrentFilter(RegionFilter.us)}
      />
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
              <OdsCard
                key={region}
                className={`flex items-center p-3 cursor-pointer transition-shadow ${borderStyle} w-full sm:w-[245px]`}
                onClick={() => setSelectedRegion(region)}
                color={ODS_CARD_COLOR.neutral}
              >
                <span
                  className={`fi-${getCountryCode(
                    region,
                  )} w-[44px] h-[32px] shadow-md shadow-[${shadowColor}] mr-3`}
                />
                <div className="flex flex-col">
                  <OdsText className="block" preset={ODS_TEXT_PRESET.heading4}>
                    {t(getCountryKey(region))}
                  </OdsText>
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {t(getCityNameKey(region))}
                  </OdsText>
                  <OdsText preset={ODS_TEXT_PRESET.span}>{region}</OdsText>
                </div>
              </OdsCard>
            );
          })}
      </div>
    </div>
  );
};

export default RegionSelector;
