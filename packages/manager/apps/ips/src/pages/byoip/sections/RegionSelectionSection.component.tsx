import React from 'react';

import { useTranslation } from 'react-i18next';

import { OdsSpinner } from '@ovhcloud/ods-components/react';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { RegionCard } from '@/components/RegionCard/RegionCard.component';
import { DATACENTER_TO_REGION } from '@/data/hooks/catalog';
import { CONFIG_NAME, useGetCatalog } from '@/data/hooks/catalog/useGetCatalog';
import { TRANSLATION_NAMESPACES } from '@/utils';

import { ByoipContext } from '../Byoip.context';
import { getConfigValues } from '../Byoip.utils';

type CampusType = {
  name: string;
  planCode: string;
};

export const RegionSelectionSection: React.FC = () => {
  const { t } = useTranslation([TRANSLATION_NAMESPACES.byoip]);
  const { data: catalog, isLoading } = useGetCatalog();
  const { selectedRegion, setSelectedRegion } = React.useContext(ByoipContext);
  const { trackClick } = useOvhTracking();

  const campusValues = getConfigValues(
    catalog?.details?.product.configurations,
    CONFIG_NAME.CAMPUS,
  ) as CampusType[];

  return (
    <OrderSection
      title={t('region_selection_title')}
      description={t('region_selection_description')}
      isLoading={isLoading}
    >
      <React.Suspense fallback={<OdsSpinner />}>
        <div className="flex flex-wrap items-stretch gap-4">
          {campusValues.map((value) => {
            const region = DATACENTER_TO_REGION[value.name];
            return (
              <RegionCard
                region={region}
                key={value.name}
                isSelected={selectedRegion === value.name}
                onClick={() => {
                  setSelectedRegion(value.name);
                  if (value.name) {
                    trackClick({
                      actionType: 'action',
                      buttonType: ButtonType.button,
                      location: PageLocation.funnel,
                      actions: [`select_${value.name.toLowerCase()}`],
                    });
                  }
                }}
              />
            );
          })}
        </div>
      </React.Suspense>
    </OrderSection>
  );
};
