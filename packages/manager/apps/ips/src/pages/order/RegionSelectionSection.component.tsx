import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsMessage,
  OdsSelect,
  OdsSkeleton,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useQuery } from '@tanstack/react-query';
import { OrderSection } from './OrderSection.component';
import { getVrackList } from '@/data/api/vrack';
import { useAdditionalIpsRegions } from '@/data/hooks/catalog';
import RegionSelector from '@/components/RegionSelector/RegionSelector';

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
