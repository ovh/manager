import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsMessage, OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OrderSection } from './OrderSection.component';
import { useAdditionalIpsRegions } from '@/data/hooks/catalog';
import { RegionSelector } from '@/components/RegionSelector/region-selector.component';
import { IpVersion } from './order.constant';

export type RegionSelectionSectionProps = {
  selectedRegion?: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
};

export const RegionSelectionSection: React.FC<RegionSelectionSectionProps> = ({
  selectedRegion,
  setSelectedRegion,
}) => {
  const { t } = useTranslation('order');
  const { regionList, isLoading, isError, error } = useAdditionalIpsRegions();

  return (
    <OrderSection title={t('region_selection_title')}>
      {isError && (
        <OdsMessage color={ODS_MESSAGE_COLOR.critical}>
          {t('error_message', { error })}
        </OdsMessage>
      )}
      {isLoading ? (
        <OdsSpinner />
      ) : (
        <RegionSelector
          regionList={regionList}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />
      )}
    </OrderSection>
  );
};
