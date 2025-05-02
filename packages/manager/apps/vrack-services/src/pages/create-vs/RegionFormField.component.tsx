import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useVrackServicesRegion } from '@ovh-ux/manager-network-common';
import { RegionSelector } from '@/components/RegionSelector/region-selector.component';

export type RegionFormFieldProps = {
  selectedRegion: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
};

export const RegionFormField: React.FC<RegionFormFieldProps> = ({
  selectedRegion,
  setSelectedRegion,
}) => {
  const { t } = useTranslation('vrack-services/create');
  const { data, isLoading: isRegionLoading } = useVrackServicesRegion();

  return (
    <>
      <OdsText className="block mt-8 mb-4" preset={ODS_TEXT_PRESET.heading4}>
        {t('regionLabel')}
      </OdsText>
      <OdsText className="block mb-6" preset={ODS_TEXT_PRESET.paragraph}>
        {t('regionDescription')}
      </OdsText>
      <div className="mb-5">
        {isRegionLoading ? (
          <OdsSpinner size={ODS_SPINNER_SIZE.lg} />
        ) : (
          <RegionSelector
            regionList={data?.data?.map(({ name }) => name)}
            setSelectedRegion={setSelectedRegion}
            selectedRegion={selectedRegion}
          />
        )}
      </div>
    </>
  );
};
