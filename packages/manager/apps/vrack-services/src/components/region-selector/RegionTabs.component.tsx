import React from 'react';

import { useTranslation } from 'react-i18next';

import { Tab, TabList, Tabs } from '@ovhcloud/ods-react';

import { TRANSLATION_NAMESPACES } from '@/utils/constants';

import {
  RegionFilter,
  isRegionInAp,
  isRegionInCa,
  isRegionInEu,
  isRegionInUs,
} from './RegionSelector.utils';

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
  const { t } = useTranslation(TRANSLATION_NAMESPACES.regionSelector);
  const hasEu = regionList.some(isRegionInEu);
  const hasCa = regionList.some(isRegionInCa);
  const hasUs = regionList.some(isRegionInUs);
  const hasAp = regionList.some(isRegionInAp);

  return (
    <Tabs className="mb-4" value={currentFilter}>
      <TabList>
        <Tab value={RegionFilter.all} onClick={removeFilter}>
          {t('region-selector-all-locations')}
        </Tab>
        {hasEu && (
          <Tab value={RegionFilter.eu} onClick={() => hasEu && setEuFilter()}>
            {t('region-selector-eu-filter')}
          </Tab>
        )}
        {hasCa && (
          <Tab value={RegionFilter.ca} onClick={() => hasCa && setCaFilter()}>
            {t('region-selector-ca-filter')}
          </Tab>
        )}
        {hasUs && (
          <Tab value={RegionFilter.us} onClick={() => hasUs && setUsFilter()}>
            {t('region-selector-us-filter')}
          </Tab>
        )}
        {hasAp && (
          <Tab value={RegionFilter.ap} onClick={() => hasAp && setApFilter()}>
            {t('region-selector-ap-filter')}
          </Tab>
        )}
      </TabList>
    </Tabs>
  );
};

export default RegionTabs;
