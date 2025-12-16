import React from 'react';
import { useTranslation } from 'react-i18next';
import { SPINNER_SIZE, TEXT_PRESET, Spinner, Text } from '@ovhcloud/ods-react';
import { useVrackServicesRegion } from '@ovh-ux/manager-network-common';
import { RegionSelector } from '@/components/RegionSelector/region-selector.component';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export type RegionFormFieldProps = {
  selectedRegion: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
};

export const RegionFormField: React.FC<RegionFormFieldProps> = ({
  selectedRegion,
  setSelectedRegion,
}) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.create);
  const { data, isLoading: isRegionLoading } = useVrackServicesRegion();

  return (
    <>
      <Text className="block mt-8 mb-4" preset={TEXT_PRESET.heading4}>
        {t('regionLabel')}
      </Text>
      <Text className="block mb-6" preset={TEXT_PRESET.paragraph}>
        {t('regionDescription')}
      </Text>
      <div className="mb-5">
        {isRegionLoading ? (
          <Spinner size={SPINNER_SIZE.lg} />
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
