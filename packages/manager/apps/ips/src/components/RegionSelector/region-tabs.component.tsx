import React from 'react';
import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';
import { handleClick } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  RegionFilter,
  isRegionInCa,
  isRegionInEu,
  isRegionInUs,
  isRegionInAp,
} from './region-selector.utils';

export type RegionTabsProps = {
  regionList?: string[];
  currentFilter: RegionFilter;
  setEuFilter: () => void;
  setCaFilter: () => void;
  setUsFilter: () => void;
  setApFilter: () => void;
  removeFilter: () => void;
};

export const RegionTabs: React.FC<RegionTabsProps> = ({
  regionList = [],
  currentFilter,
  setEuFilter,
  setCaFilter,
  setUsFilter,
  setApFilter,
  removeFilter,
}) => {
  const { t } = useTranslation('region-selector');
  const hasEu = regionList.some(isRegionInEu);
  const hasCa = regionList.some(isRegionInCa);
  const hasUs = regionList.some(isRegionInUs);
  const hasAp = regionList.some(isRegionInAp);

  return (
    <OdsTabs className="mb-4">
      <OdsTab
        isSelected={currentFilter === RegionFilter.all}
        {...handleClick(removeFilter)}
      >
        {t('region-selector-all-locations')}
      </OdsTab>
      {hasEu && (
        <OdsTab
          isSelected={currentFilter === RegionFilter.eu}
          {...handleClick(() => hasEu && setEuFilter())}
        >
          {t('region-selector-eu-filter')}
        </OdsTab>
      )}
      {hasCa && (
        <OdsTab
          isSelected={currentFilter === RegionFilter.ca}
          {...handleClick(() => hasCa && setCaFilter())}
        >
          {t('region-selector-ca-filter')}
        </OdsTab>
      )}
      {hasUs && (
        <OdsTab
          isSelected={currentFilter === RegionFilter.us}
          {...handleClick(() => hasUs && setUsFilter())}
        >
          {t('region-selector-us-filter')}
        </OdsTab>
      )}
      {hasAp && (
        <OdsTab
          isSelected={currentFilter === RegionFilter.ap}
          {...handleClick(() => hasAp && setApFilter())}
        >
          {t('region-selector-ap-filter')}
        </OdsTab>
      )}
    </OdsTabs>
  );
};

export default RegionTabs;
