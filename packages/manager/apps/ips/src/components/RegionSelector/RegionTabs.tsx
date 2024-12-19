import React from 'react';
import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { RegionFilter, isCa, isEu, isUs } from './regionSelector.utils';

export type RegionTabsProps = {
  regionList?: string[];
  currentFilter: RegionFilter;
  setEuFilter: () => void;
  setCaFilter: () => void;
  setUsFilter: () => void;
  removeFilter: () => void;
};

export const RegionTabs: React.FC<RegionTabsProps> = ({
  regionList = [],
  currentFilter,
  setEuFilter,
  setCaFilter,
  setUsFilter,
  removeFilter,
}) => {
  const { t } = useTranslation('region-selector');
  return (
    <OdsTabs className="mb-4">
      <OdsTab
        isSelected={currentFilter === RegionFilter.all}
        onClick={removeFilter}
      >
        {t('region-selector-all-locations')}
      </OdsTab>
      <OdsTab
        isSelected={currentFilter === RegionFilter.eu}
        isDisabled={!regionList.some(isEu)}
        onClick={() => regionList.some(isEu) && setEuFilter()}
      >
        {t('region-selector-eu-filter')}
      </OdsTab>
      <OdsTab
        isSelected={currentFilter === RegionFilter.ca}
        isDisabled={!regionList.some(isCa)}
        onClick={() => regionList.some(isCa) && setCaFilter()}
      >
        {t('region-selector-ca-filter')}
      </OdsTab>
      <OdsTab
        isSelected={currentFilter === RegionFilter.us}
        isDisabled={!regionList.some(isUs)}
        onClick={() => regionList.some(isUs) && setUsFilter()}
      >
        {t('region-selector-us-filter')}
      </OdsTab>
    </OdsTabs>
  );
};

export default RegionTabs;
