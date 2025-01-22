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
import { useOrganisationList } from '@/data/hooks/organisation';
import { OrderContext } from '../order.context';
import { isAvailableOrganisation } from '../order.utils';

export const OrganisationSection: React.FC = () => {
  const {
    selectedOrganisation,
    setSelectedOrganisation,
    selectedRegion,
  } = React.useContext(OrderContext);
  const { t } = useTranslation('order');
  const { data, isLoading } = useOrganisationList();
  const { shell } = React.useContext(ShellContext);

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
        {t('organisation_selection_info')}
      </OdsMessage>
      {isLoading ? (
        <OdsSkeleton />
      ) : (
        <OdsSelect
          key={data?.data.join('-')}
          className="block w-full max-w-[384px] mb-1"
          name="ip-organisation"
          onOdsChange={(event) =>
            setSelectedOrganisation(event.target.value as string)
          }
          value={selectedOrganisation}
          placeholder={t('organisation_select_placeholder')}
        >
          {data?.data
            .filter(isAvailableOrganisation(selectedRegion))
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
