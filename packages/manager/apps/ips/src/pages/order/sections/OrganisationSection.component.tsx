import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import {
  MESSAGE_COLOR,
  MessageBody,
  SelectContent,
  SelectControl,
  Link,
  Message,
  Select,
  Skeleton,
} from '@ovhcloud/ods-react';
import { Link as RouterLink } from 'react-router-dom';

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
import { TRANSLATION_NAMESPACES } from '@/utils';

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
  const { t } = useTranslation(TRANSLATION_NAMESPACES.order);
  const { trackClick } = useOvhTracking();
  const { organisations, loading } = useGetOrganisationsList();
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

  return (
    <OrderSection
      title={t('organisation_selection_title')}
      description={t('organisation_selection_description')}
    >
      <Message
        dismissible={false}
        className="mb-3 block"
        color={MESSAGE_COLOR.information}
      >
        <MessageBody>{organisationInfoLabel}</MessageBody>
      </Message>
      {loading ? (
        <Skeleton />
      ) : (
        <Select
          key={organisations?.join('-') || 'org-select'}
          className="mb-1 block w-full max-w-[384px]"
          name="ip-organisation"
          onValueChange={(event) => {
            const updatedOrganisation =
              event.value?.[0] !== NO_ORGANISATION
                ? event.value?.[0]
                : undefined;
            setSelectedOrganisation(updatedOrganisation);

            if (updatedOrganisation) {
              trackClick({
                actionType: 'action',
                buttonType: ButtonType.button,
                location: PageLocation.funnel,
                actions: [`select_${updatedOrganisation}`],
              });
            }
          }}
          value={[selectedOrganisation]}
          items={[
            { label: t('organisation_select_none'), value: NO_ORGANISATION },
            ...(organisations
              ?.filter(isAvailableOrganisation(selectedPlanCode))
              .map((orgId) => ({
                label: orgId,
                value: orgId,
              })) || []),
          ]}
        >
          <SelectContent />
          <SelectControl placeholder={t('organisation_select_placeholder')} />
        </Select>
      )}
      <Link as={RouterLink} to={urls.manageOrganisations}>
        {t('go_to_organisation_list_link_label')}
      </Link>
    </OrderSection>
  );
};
