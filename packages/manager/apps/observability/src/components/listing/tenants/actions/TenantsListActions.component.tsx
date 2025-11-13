import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ActionMenu,
  ActionMenuItemProps,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  ICON_NAME,
  POPOVER_POSITION,
} from '@ovh-ux/muk';

import { getDeleteTenantUrl } from '@/routes/Routes.utils';

import { TenantsListActionsProps } from './TenantsListActions.props';

export default function TenantsListActions({ tenantId }: TenantsListActionsProps) {
  const { t } = useTranslation(['tenants', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

  // TODO: add urn resource for IAM actions
  const items: ActionMenuItemProps[] = [
    {
      id: 1,
      label: t('tenants:listing.details_action'),
      onClick: () => {
        navigate(tenantId);
      },
    },
    {
      id: 2,
      label: t(`${NAMESPACES.ACTIONS}:modify`),
    },
    {
      id: 3,
      label: t('tenants:listing.access_grafana_action'),
    },
    {
      id: 4,
      label: t('tenants:listing.copy_uid_action'),
    },
    {
      id: 5,
      label: t('tenants:listing.generate_access_token_action'),
    },
    {
      id: 6,
      label: t(`${NAMESPACES.ACTIONS}:delete`),
      color: BUTTON_COLOR.critical,
      onClick: () => {
        navigate(getDeleteTenantUrl(tenantId));
      },
    },
  ];

  return (
    <div className="flex justify-end">
      <ActionMenu
        items={items}
        isCompact
        variant={BUTTON_VARIANT.ghost}
        icon={ICON_NAME.ellipsisVertical}
        popoverPosition={POPOVER_POSITION.bottomEnd}
        id={`actions-${tenantId}`}
      />
    </div>
  );
}
