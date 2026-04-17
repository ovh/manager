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
import {
  CONFIG_NAME,
  getRirFromPlanCode,
  useGetCatalog,
} from '@/data/hooks/catalog/useGetCatalog';
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
  const { ipRir, selectedRegion, setSelectedRegion } =
    React.useContext(ByoipContext);
  const { trackClick } = useOvhTracking();

  const allCampusValues = getConfigValues(
    catalog?.details?.product.configurations,
    CONFIG_NAME.CAMPUS,
  ) as CampusType[];

  // When the catalog exposes multiple RIR-specific plan codes, keep only the
  // campuses attached to the selected RIR. Otherwise fall back to the full list.
  const campusValues = ipRir
    ? allCampusValues.filter(
        (campus) => getRirFromPlanCode(campus.planCode) === ipRir.toUpperCase(),
      )
    : allCampusValues;
  const campusValuesToDisplay =
    campusValues.length > 0 ? campusValues : allCampusValues;

  return (
    <OrderSection
      title={t('region_selection_title')}
      description={t('region_selection_description')}
      isLoading={isLoading}
    >
      <React.Suspense fallback={<OdsSpinner />}>
        <div className="flex flex-wrap items-stretch gap-7">
          {campusValuesToDisplay.map((value) => {
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
