import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_POPOVER_POSITION,
} from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';

import { TenantsListActionsProps } from './TenantsListActions.props';

export default function TenantsListActions({ tenantId }: TenantsListActionsProps) {
  const { t } = useTranslation(['tenants', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

  const items: ActionMenuItem[] = [
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
      color: ODS_BUTTON_COLOR.critical,
    },
  ];

  return (
    <div className="flex justify-end">
      <ActionMenu
        items={items}
        isCompact
        variant={ODS_BUTTON_VARIANT.ghost}
        icon={ODS_ICON_NAME.ellipsisVertical}
        popoverPosition={ODS_POPOVER_POSITION.bottomEnd}
        id={`actions-${tenantId}`}
      />
    </div>
  );
}
