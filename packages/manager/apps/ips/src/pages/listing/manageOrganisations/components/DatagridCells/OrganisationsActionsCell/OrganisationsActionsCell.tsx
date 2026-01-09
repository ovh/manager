import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { OrgDetails } from '@/data/api';
import { urlDynamicParts, urls } from '@/routes/routes.constant';

export const OrganisationsActionsCell = (organisation: OrgDetails) => {
  const { t } = useTranslation('manage-organisations');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('manageOrganisationsTabEditOrgAction'),
      onClick: () => {
        trackClick({
          actionType: 'action',
          buttonType: ButtonType.button,
          location: PageLocation.datagrid,
          actions: ['edit_organization'],
        });
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
        trackClick({
          actionType: 'action',
          buttonType: ButtonType.button,
          location: PageLocation.datagrid,
          actions: ['delete_organization'],
        });
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
