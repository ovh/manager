import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_VARIANT, ICON_NAME, POPOVER_POSITION } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, ActionMenuItemProps, LinkType } from '@ovh-ux/muk';

import { ManagedDashboardsActionsProps } from '@/components/listing/managedDashboards/actions/ManagedDashboardsActions.props';
import { GrafanaListing } from '@/types/managedDashboards.type';

export default function ManagedDashboardsActions({
  managedDashboard,
}: ManagedDashboardsActionsProps<GrafanaListing>) {
  const { t } = useTranslation(['managed-dashboards', NAMESPACES.ACTIONS]);

  const onCopyUrn = useCallback(() => {
    if (managedDashboard.urn) {
      void navigator.clipboard.writeText(managedDashboard.urn);
    } else {
      // TODO: handle empty or missing URN
    }
  }, [managedDashboard.urn]);

  // TODO: add urn resource for IAM actions
  const items: ActionMenuItemProps[] = [
    {
      id: 1,
      label: t('managed-dashboards:listing.open_instance_action'),
      linktype: LinkType.external,
      target: '_blank',
      href: managedDashboard.endpoint,
      isDisabled: true,
    },
    {
      id: 2,
      label: t(`${NAMESPACES.ACTIONS}:modify`),
      onClick: () => {
        alert('TODO: edit grafana');
      },
    },
    {
      id: 3,
      label: t('managed-dashboards:listing.copy_urn_action'),
      onClick: onCopyUrn,
    },
    {
      id: 4,
      label: t(`${NAMESPACES.ACTIONS}:delete`),
      color: BUTTON_COLOR.critical,
      onClick: () => {
        alert('TODO: delete grafana');
      },
    },
  ];

  return (
    <div className="flex justify-end">
      <ActionMenu
        items={items}
        isCompact={true}
        variant={BUTTON_VARIANT.ghost}
        icon={ICON_NAME.ellipsisVertical}
        popoverPosition={POPOVER_POSITION.bottomEnd}
        id={`actions-${managedDashboard.id}`}
      />
    </div>
  );
}
