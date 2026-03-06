import React from 'react';

import { useTranslation } from 'react-i18next';

import { SPINNER_SIZE, Spinner, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { useVrackServicesRegion } from '@ovh-ux/manager-network-common';

import { RegionSelector } from '@/components/region-selector/RegionSelector.component';
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
      <Text className="mb-4 mt-8 block" preset={TEXT_PRESET.heading4}>
        {t('regionLabel')}
      </Text>
      <Text className="mb-6 block" preset={TEXT_PRESET.paragraph}>
        {t('regionDescription')}
      </Text>
      <div className="mb-5">
        {isRegionLoading ? (
          <Spinner size={SPINNER_SIZE.lg} />
        ) : (
          <RegionSelector
            regionList={data?.data?.map(({ name }) => name) || []}
            setSelectedRegion={setSelectedRegion}
            selectedRegion={selectedRegion}
          />
        )}
      </div>
    </>
  );
};
