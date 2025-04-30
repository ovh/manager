import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { OptionCard } from '@/components/OptionCard/OptionCard.component';
import { useCatalog, CONFIG_NAME } from '@/utils/getCatalog';
import { getConfigValues } from '@/utils/getConfigValues';

type CampusType = {
  name: string;
  planCode: string;
};

export const RegionSelectionSection: React.FC = () => {
  const { t } = useTranslation('byoip');
  const { data: catalog, isLoading } = useCatalog();
  const [selectedRegion, setSelectedRegion] = React.useState<string>('');

  const campusValues = getConfigValues(
    catalog?.details.product.configurations,
    CONFIG_NAME.CAMPUS,
  ) as CampusType[];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  /* TODO: Change the option card */
  return (
    <OrderSection
      title={t('region_selection_title')}
      description={t('region_selection_description')}
    >
      <div className="grid grid-cols-4 gap-1">
        {campusValues.map((value) => (
          <OptionCard
            key={value.name}
            title={value.name}
            isSelected={selectedRegion === value.name}
            onClick={() => setSelectedRegion(value.name)}
          >
            <OdsText className="text-xs" preset={ODS_TEXT_PRESET.paragraph}>
              {value.name}
            </OdsText>
          </OptionCard>
        ))}
      </div>
    </OrderSection>
  );
};
