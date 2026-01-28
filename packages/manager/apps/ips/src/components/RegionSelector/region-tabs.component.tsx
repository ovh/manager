import React from 'react';

import { useTranslation } from 'react-i18next';

import { Tab, Tabs, TabList } from '@ovhcloud/ods-react';

import {
  RegionFilter,
  isRegionInAp,
  isRegionInCa,
  isRegionInEu,
  isRegionInUs,
} from './region-selector.utils';

export type RegionTabsProps = {
  regionList?: string[];
  currentFilter: RegionFilter;
  setCurrentFilter: React.Dispatch<React.SetStateAction<RegionFilter>>;
};

export const RegionTabs: React.FC<RegionTabsProps> = ({
  regionList = [],
  currentFilter,
  setCurrentFilter,
}) => {
  const { t } = useTranslation('region-selector');
  const hasEu = regionList.some(isRegionInEu);
  const hasCa = regionList.some(isRegionInCa);
  const hasUs = regionList.some(isRegionInUs);
  const hasAp = regionList.some(isRegionInAp);

  return (
    <Tabs
      className="mb-4"
      value={currentFilter}
      onValueChange={(e) => setCurrentFilter(e.value as RegionFilter)}
    >
      <TabList>
        <Tab value={RegionFilter.all}>{t('region-selector-all-locations')}</Tab>
        {hasEu && (
          <Tab value={RegionFilter.eu}>{t('region-selector-eu-filter')}</Tab>
        )}
        {hasCa && (
          <Tab value={RegionFilter.ca}>{t('region-selector-ca-filter')}</Tab>
        )}
        {hasUs && (
          <Tab value={RegionFilter.us}>{t('region-selector-us-filter')}</Tab>
        )}
        {hasAp && (
          <Tab value={RegionFilter.ap}>{t('region-selector-ap-filter')}</Tab>
        )}
      </TabList>
    </Tabs>
  );
};

export default RegionTabs;
