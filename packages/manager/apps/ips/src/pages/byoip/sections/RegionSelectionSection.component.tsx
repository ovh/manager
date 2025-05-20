import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText, OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { RegionCard } from '@/components/RegionCard/RegionCard.component';
import { useGetCatalog, CONFIG_NAME } from '@/data/hooks/catalog/useGetCatalog';
import { getConfigValues } from '../Byoip.utils';
import { ByoipContext } from '../Byoip.context';

type CampusType = {
  name: string;
  planCode: string;
};

export const RegionSelectionSection: React.FC = () => {
  const { t } = useTranslation('byoip');
  const { data: catalog, isLoading } = useGetCatalog();
  const { selectedRegion, setSelectedRegion } = React.useContext(ByoipContext);

  const campusValues = getConfigValues(
    catalog?.details.product.configurations,
    CONFIG_NAME.CAMPUS,
  ) as CampusType[];

  if (isLoading) {
    return (
      <div>
        <OdsSpinner size={ODS_SPINNER_SIZE.sm} />
      </div>
    );
  }

  return (
    <OrderSection
      title={t('region_selection_title')}
      description={t('region_selection_description')}
    >
      <div className="grid grid-cols-3 gap-2">
        {campusValues.map((value) => (
          <RegionCard
            key={value.name}
            title={value.name}
            isSelected={selectedRegion === value.name}
            onClick={() => {
              setSelectedRegion(value.name);
            }}
          >
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>{value.name}</OdsText>
          </RegionCard>
        ))}
      </div>
    </OrderSection>
  );
};
