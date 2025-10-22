import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { OrgDetails } from '@/data/api';
import { urls, urlDynamicParts } from '@/routes/routes.constant';

export const OrganisationsActionsCell = (organisation: OrgDetails) => {
  const { t } = useTranslation('manage-organisations');
  const navigate = useNavigate();

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('manageOrganisationsTabEditOrgAction'),
      onClick: () => {
        navigate(
          `${urls.openOrganisationsModal.replace(
            urlDynamicParts.organisationId,
            organisation.organisationId,
          )}?mode="edit"`,
        );
      },
    },
    {
      id: 2,
      label: t('manageOrganisationsTabDeleteOrgAction'),
      onClick: () => {
        navigate(
          urls.deleteOrganisation.replace(
            urlDynamicParts.organisationId,
            organisation.organisationId,
          ),
        );
      },
    },
  ];

  return (
    <ActionMenu
      id={`manageOrgActionMenu-${organisation?.registry}-${organisation?.organisationId}`}
      items={items}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      icon={ODS_ICON_NAME.ellipsisVertical}
    />
  );
};
