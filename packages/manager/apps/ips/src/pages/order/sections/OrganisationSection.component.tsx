import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Links } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsSelect,
  OdsSkeleton,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_COLOR,
  OdsSelectChangeEventDetail,
  OdsSelectCustomEvent,
} from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { useGetOrganisationsList } from '@/data/hooks/organisation';
import { OrderContext } from '../order.context';
import { isAvailableOrganisation } from '../order.utils';
import { isRegionInEu } from '@/components/RegionSelector/region-selector.utils';
import { useCheckServiceAvailability } from '@/data/hooks/useCheckServiceAvailability';
import { useServiceRegion } from '@/data/hooks/useServiceRegion';
import { urls } from '@/routes/routes.constant';

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
  const { shell } = React.useContext(ShellContext);
  const { t } = useTranslation('order');
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
  }, [selectedOrganisation, selectedRegion, selectedServiceRegion]);

  const handleOrganisationChange = (
    event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>,
  ) => {
    const updatedOrganisation =
      event.detail.value !== NO_ORGANISATION ? event.detail.value : undefined;
    setSelectedOrganisation(updatedOrganisation);
  };

  return (
    <OrderSection
      title={t('organisation_selection_title')}
      description={t('organisation_selection_description')}
    >
      <OdsMessage
        isDismissible={false}
        className="block mb-3"
        color={ODS_MESSAGE_COLOR.information}
      >
        {organisationInfoLabel}
      </OdsMessage>
      {isLoading ? (
        <OdsSkeleton />
      ) : (
        <OdsSelect
          key={organisations.join('-')}
          className="block w-full max-w-[384px] mb-1"
          name="ip-organisation"
          onOdsChange={handleOrganisationChange}
          value={selectedOrganisation}
          placeholder={t('organisation_select_placeholder')}
        >
          <option value={NO_ORGANISATION}>
            {t('organisation_select_none')}
          </option>
          {organisations
            .filter(isAvailableOrganisation(selectedPlanCode))
            .map((orgId) => (
              <option key={orgId} value={orgId}>
                {orgId}
              </option>
            ))}
        </OdsSelect>
      )}
      <Links
        label={t('go_to_organisation_list_link_label')}
        onClickReturn={() => navigate(urls.manageOrganisations)}
      />
    </OrderSection>
  );
};
