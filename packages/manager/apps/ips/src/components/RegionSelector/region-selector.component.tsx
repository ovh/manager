import React from 'react';
import { OdsCard, OdsPopover, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_CARD_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { handleClick } from '@ovh-ux/manager-react-components';
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
            const borderStyle =
              selectedRegion === region && !disabledMessage
                ? `region_selector_selected`
                : `m-[1px] hover:shadow-md`;

            return (
              <div key={region}>
                {disabledMessage && (
                  <OdsPopover triggerId={region} withArrow className="max-w-sm">
                    {disabledMessage}
                  </OdsPopover>
                )}
                <OdsCard
                  id={region}
                  tabIndex={0}
                  className={`flex items-center p-3 transition-shadow cursor-pointer ${borderStyle} w-full sm:w-[245px] ${
                    disabledMessage ? 'opacity-40' : ''
                  }`}
                  {...handleClick(
                    () => !disabledMessage && setSelectedRegion(region),
                  )}
                  color={ODS_CARD_COLOR.neutral}
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
                    <OdsText
                      className="block"
                      preset={ODS_TEXT_PRESET.heading4}
                    >
                      {t(getCountryKey(region))}
                    </OdsText>
                    <OdsText preset={ODS_TEXT_PRESET.span}>
                      {t(getCityNameKey(region))}
                    </OdsText>
                    <OdsText preset={ODS_TEXT_PRESET.span}>{region}</OdsText>
                  </div>
                </OdsCard>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default RegionSelector;
