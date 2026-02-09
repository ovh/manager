import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { IamServiceAccount } from '@/data/api/iam-service-accounts';
import { subRoutes } from '@/routes/routes.constant';
import { SERVICE_ACCOUNTS_TRACKING } from '@/tracking.constant';

export function Actions({ account }: { account: IamServiceAccount }) {
  const { t } = useTranslation(NAMESPACES.ACTIONS);
  const { trackClick } = useOvhTracking();

  const editHref = useHref(
    subRoutes.serviceAccountsEdit.replace(':clientId', account.clientId),
  );
  const deleteHref = useHref(
    subRoutes.serviceAccountsDelete.replace(':clientId', account.clientId),
  );
  const items: ActionMenuItem[] = [
    {
      id: 0,
      label: t('modify'),
      href: editHref,
      onClick: () => {
        trackClick({
          actionType: 'action',
          actions: SERVICE_ACCOUNTS_TRACKING.LISTING.EDIT_ACCOUNT,
        });
      },
    },
    {
      id: 1,
      label: t('delete'),
      href: deleteHref,
      onClick: () => {
        trackClick({
          actionType: 'action',
          actions: SERVICE_ACCOUNTS_TRACKING.LISTING.DELETE_ACCOUNT,
        });
      },
    },
  ];
  return (
    <ActionMenu
      id={`manage-tokens-actions_${account.clientId}`}
      items={items}
      isCompact
    />
  );
}
