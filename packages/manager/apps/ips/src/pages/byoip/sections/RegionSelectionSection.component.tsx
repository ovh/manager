import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { RegionCard } from '@/components/RegionCard/RegionCard.component';
import { useGetCatalog, CONFIG_NAME } from '@/data/hooks/catalog/useGetCatalog';
import { getConfigValues } from '../Byoip.utils';
import { ByoipContext } from '../Byoip.context';
import { DATACENTER_TO_REGION } from '@/data/hooks/catalog';
import { TRANSLATION_NAMESPACES } from '@/utils';

type CampusType = {
  name: string;
  planCode: string;
};

export const RegionSelectionSection: React.FC = () => {
  const { t } = useTranslation([TRANSLATION_NAMESPACES.byoip]);
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
      <React.Suspense fallback={<OdsSpinner />}>
        <div className="flex flex-wrap gap-4">
          {campusValues.map((value) => {
            const region = DATACENTER_TO_REGION[value.name];
            return (
              <RegionCard
                region={region}
                key={value.name}
                isSelected={selectedRegion === value.name}
                onClick={() => {
                  setSelectedRegion(value.name);
                }}
              />
            );
          })}
        </div>
      </React.Suspense>
    </OrderSection>
  );
};
