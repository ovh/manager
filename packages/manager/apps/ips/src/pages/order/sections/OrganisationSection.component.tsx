import React from 'react';
import { useTranslation } from 'react-i18next';
import { Links } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsSelect,
  OdsSkeleton,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { useGetOrganisationsList } from '@/data/hooks/organisation';
import { OrderContext } from '../order.context';
import { isAvailableOrganisation } from '../order.utils';
import { isRegionInEu } from '@/components/RegionSelector/region-selector.utils';

export const OrganisationSection: React.FC = () => {
  const {
    selectedOrganisation,
    setSelectedOrganisation,
    selectedPlanCode,
    selectedRegion,
  } = React.useContext(OrderContext);
  const { shell } = React.useContext(ShellContext);
  const { t } = useTranslation('order');
  const { organisations, isLoading } = useGetOrganisationsList();

  return (
    <OrderSection
      title={t('organisation_selection_title')}
      description={
        t('organisation_selection_description') +
        (isRegionInEu(selectedRegion)
          ? t('organisation_selection_description_no_organisation_RIPE')
          : t('organisation_selection_description_no_organisation_ARIN'))
      }
    >
      <OdsMessage
        isDismissible={false}
        className="block mb-3"
        color={ODS_MESSAGE_COLOR.information}
      >
        {t('organisation_selection_info')}
      </OdsMessage>
      {isLoading ? (
        <OdsSkeleton />
      ) : (
        <OdsSelect
          key={organisations.join('-')}
          className="block w-full max-w-[384px] mb-1"
          name="ip-organisation"
          onOdsChange={(event) =>
            setSelectedOrganisation(event.detail.value as string)
          }
          value={selectedOrganisation}
          placeholder={t('organisation_select_placeholder')}
        >
          <option value={undefined}>{t('organisation_select_none')}</option>
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
        onClickReturn={() =>
          shell.navigation.navigateTo('dedicated', '#/ip/organisation', {})
        }
      />
    </OrderSection>
  );
};
