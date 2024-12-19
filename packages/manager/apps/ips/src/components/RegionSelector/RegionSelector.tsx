import React from 'react';
import { OdsCard, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_CARD_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { RegionTabs } from './RegionTabs';
import {
  RegionFilter,
  isRegionInCa,
  isRegionInEu,
  isRegionInUs,
  selectedBorderColor,
  shadowColor,
} from './regionSelector.utils';
import 'flag-icons/css/flag-icons.min.css';

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
            const countryCode = t(`region-selector-country-code_${region}`);
            const isSelected = selectedRegion === region;
            const color = isSelected
              ? ODS_CARD_COLOR.primary
              : ODS_CARD_COLOR.neutral;
            const borderStyle = isSelected
              ? `border-[2px] border-[${selectedBorderColor}]`
              : 'm-[1px]';

            return (
              <OdsCard
                key={region}
                className={`flex items-center p-3 cursor-pointer ${borderStyle} hover:border-[${selectedBorderColor}] w-full sm:w-[245px]`}
                onClick={() => setSelectedRegion(region)}
                color={color}
              >
                <span
                  className={`fi-${countryCode} w-[44px] h-[32px] shadow-md shadow-[${shadowColor}] mr-3`}
                />
                <div className="flex flex-col">
                  <OdsText className="block" preset={ODS_TEXT_PRESET.heading4}>
                    {t(`region-selector-country-name_${region}`)}
                  </OdsText>
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {t(`region-selector-city-name_${region}`)}
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
