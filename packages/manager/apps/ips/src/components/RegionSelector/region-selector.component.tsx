import React from 'react';
import {
  OdsCard,
  OdsPopover,
  OdsText,
  OdsRadio,
} from '@ovhcloud/ods-components/react';
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
            const isSelected = selectedRegion === region && !disabledMessage;
            const cardStyle = isSelected
              ? `region_selector_selected`
              : `region_selector hover:shadow-md`;

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
                  className={`flex p-3 transition-shadow cursor-pointer ${cardStyle} w-full sm:w-[311px] ${
                    disabledMessage ? 'opacity-40' : ''
                  }`}
                  {...handleClick(
                    () => !disabledMessage && setSelectedRegion(region),
                  )}
                  color={ODS_CARD_COLOR.neutral}
                >
                  <span className="flex h-full mr-3">
                    <OdsRadio name="" is-checked={isSelected}></OdsRadio>
                  </span>
                  <span
                    style={{
                      backgroundImage: `url('flags/${getCountryCode(
                        region,
                      )}.svg')`,
                    }}
                    className={`w-[24px] h-[17px] shadow-md shadow-[${shadowColor}] mr-3 bg-cover`}
                  />
                  <div className="flex flex-col">
                    <OdsText
                      className="block"
                      preset={ODS_TEXT_PRESET.heading5}
                    >
                      {t(getCountryKey(region))} - {t(getCityNameKey(region))}
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
