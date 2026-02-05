import React, { useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_MESSAGE_COLOR,
  OdsSelectChangeEventDetail,
  OdsSelectCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OdsMessage,
  OdsSelect,
  OdsSkeleton,
} from '@ovhcloud/ods-components/react';

import { Links } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { isRegionInEu } from '@/components/RegionSelector/region-selector.utils';
import { useGetOrganisationsList } from '@/data/hooks/organisation';
import { useCheckServiceAvailability } from '@/data/hooks/useCheckServiceAvailability';
import { useServiceRegion } from '@/data/hooks/useServiceRegion';
import { urls } from '@/routes/routes.constant';

import { OrderContext } from '../order.context';
import { isAvailableOrganisation } from '../order.utils';

const NO_ORGANISATION = 'no_organisation';

export const OrganisationSection: React.FC = () => {
  const {
    selectedOrganisation,
    setSelectedOrganisation,
    selectedPlanCode,
    selectedRegion,
    selectedService,
    selectedServiceType,
    addDisabledService,
  } = React.useContext(OrderContext);
  const navigate = useNavigate();
  const { t } = useTranslation('order');
  const { trackClick } = useOvhTracking();
  const { organisations, isLoading } = useGetOrganisationsList();
  const { serviceStatus } = useCheckServiceAvailability({
    serviceName: selectedService,
    serviceType: selectedServiceType,
    onServiceUnavailable: addDisabledService,
  });
  const { region: selectedServiceRegion } = useServiceRegion({
    serviceName: selectedService,
    serviceType: selectedServiceType,
    serviceStatus,
  });

  const organisationInfoLabel = useMemo(() => {
    const organisationRegion = selectedRegion ?? selectedServiceRegion;
    if (selectedOrganisation) {
      return t('organisation_selection_info');
    }
    if (isRegionInEu(organisationRegion)) {
      return t('organisation_selection_description_no_organisation_RIPE');
    }
    return t('organisation_selection_description_no_organisation_ARIN');
  }, [t, selectedOrganisation, selectedRegion, selectedServiceRegion]);

  const handleOrganisationChange = (
    event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>,
  ) => {
    const updatedOrganisation =
      event.detail.value !== NO_ORGANISATION ? event.detail.value : undefined;
    setSelectedOrganisation(updatedOrganisation);

    if (updatedOrganisation) {
      trackClick({
        actionType: 'action',
        buttonType: ButtonType.button,
        location: PageLocation.funnel,
        actions: [`select_${updatedOrganisation}`],
      });
    }
  };

  return (
    <OrderSection
      title={t('organisation_selection_title')}
      description={t('organisation_selection_description')}
    >
      <OdsMessage
        isDismissible={false}
        className="mb-3 block"
        color={ODS_MESSAGE_COLOR.information}
      >
        {organisationInfoLabel}
      </OdsMessage>
      {isLoading ? (
        <OdsSkeleton />
      ) : (
        <OdsSelect
          key={organisations?.join('-') || 'org-select'}
          className="mb-1 block w-full max-w-[384px]"
          name="ip-organisation"
          onOdsChange={handleOrganisationChange}
          value={selectedOrganisation}
          placeholder={t('organisation_select_placeholder')}
        >
          <option value={NO_ORGANISATION}>
            {t('organisation_select_none')}
          </option>
          {organisations
            ?.filter(isAvailableOrganisation(selectedPlanCode))
            .map((orgId) => (
              <option key={orgId} value={orgId}>
                {orgId}
              </option>
            ))}
        </OdsSelect>
      )}
      <Links
        label={t('go_to_organisation_list_link_label')}
        onClickReturn={() => {
          navigate(urls.manageOrganisations);
        }}
      />
    </OrderSection>
  );
};
