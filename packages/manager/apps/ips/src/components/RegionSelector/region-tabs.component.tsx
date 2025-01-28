import React from 'react';
import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  RegionFilter,
  isRegionInCa,
  isRegionInEu,
  isRegionInUs,
} from './region-selector.utils';

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
  const hasEu = regionList.some(isRegionInEu);
  const hasCa = regionList.some(isRegionInCa);
  const hasUs = regionList.some(isRegionInUs);

  return (
    <OdsTabs className="mb-4">
      <OdsTab
        isSelected={currentFilter === RegionFilter.all}
        onClick={removeFilter}
      >
        {t('region-selector-all-locations')}
      </OdsTab>
      {hasEu && (
        <OdsTab
          isSelected={currentFilter === RegionFilter.eu}
          onClick={() => hasEu && setEuFilter()}
        >
          {t('region-selector-eu-filter')}
        </OdsTab>
      )}
      {hasCa && (
        <OdsTab
          isSelected={currentFilter === RegionFilter.ca}
          onClick={() => hasCa && setCaFilter()}
        >
          {t('region-selector-ca-filter')}
        </OdsTab>
      )}
      {hasUs && (
        <OdsTab
          isSelected={currentFilter === RegionFilter.us}
          onClick={() => hasUs && setUsFilter()}
        >
          {t('region-selector-us-filter')}
        </OdsTab>
      )}
    </OdsTabs>
  );
};

export default RegionTabs;
