import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { OrgDetails } from '@/data/api';
import { urls } from '@/routes/routes.constant';

export const OrganisationsActionsCell = (org: OrgDetails) => {
  const { t } = useTranslation('manage-organisations');

  const navigate = useNavigate();
  const openEditOrganisationsModal = () =>
    navigate(
      `${urls.openOrganisationsModel.replace(
        ':organisationId',
        org.organisationId,
      )}?mode="edit"`,
    );

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('manageOrganisationsTabEditOrgAction'),
      onClick: () => {
        openEditOrganisationsModal();
      },
    },
  ];

  return (
    <ActionMenu
      id={`manageOrgActionMenu-${org?.registry}-${org?.organisationId}`}
      items={items}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      icon={ODS_ICON_NAME.ellipsisVertical}
    />
  );
};
