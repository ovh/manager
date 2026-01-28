import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT, ICON_NAME } from '@ovhcloud/ods-react';

import { ActionMenu, ActionMenuItemProps } from '@ovh-ux/muk';
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

  const items: ActionMenuItemProps[] = [
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
      variant={BUTTON_VARIANT.ghost}
      icon={ICON_NAME.ellipsisVertical}
    />
  );
};
