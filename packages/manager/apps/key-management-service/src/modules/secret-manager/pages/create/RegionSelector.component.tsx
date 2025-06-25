import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { Region } from '@ovh-ux/manager-react-components';
import { RadioCard } from '@/common/components/RadioCard/RadioCard.component';

type RegionSelectorProps = {
  regions: string[];
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
};

export const RegionSelector = ({
  regions,
  selectedRegion,
  setSelectedRegion,
}: RegionSelectorProps) => {
  const { t } = useTranslation('secret-manager/create');

  return (
    <div className="flex flex-col gap-3">
      <OdsText preset="heading-4">{t('region_selector_title')}</OdsText>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {regions?.map((region) => (
          <RadioCard
            id={region}
            onChange={(event) => setSelectedRegion(event.target.value)}
            selected={selectedRegion}
            key={region}
            name="region"
            title={<Region mode={'region'} name={region} />}
            subTitle={region}
          />
        ))}
      </div>
    </div>
  );
};
