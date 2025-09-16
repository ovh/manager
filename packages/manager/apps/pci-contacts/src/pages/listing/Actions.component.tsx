import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { AccountAcl } from '@/data/api/acl';
import { urls } from '@/routes/routes.constant';
import { CONTACTS_TRACKING } from '@/tracking.constant';

type ActionsProps = {
  accountAcl: AccountAcl;
};

const getDeleteModalUrl = (accountId: string) => {
  return urls.delete.replace(':accountId', encodeURIComponent(accountId));
};

export default function Actions({ accountAcl }: Readonly<ActionsProps>) {
  const { t } = useTranslation('contacts');
  const { trackClick } = useOvhTracking();
  const deleteAclHref = useHref(`./${getDeleteModalUrl(accountAcl.accountId)}`);
  const items = [
    {
      id: 1,
      label: t('delete'),
      href: deleteAclHref,
      onClick: () => {
        trackClick({
          actionType: 'action',
          actions: CONTACTS_TRACKING.LISTING.DELETE_CONTACT,
        });
      },
    },
  ];
  return (
    <ActionMenu
      id={accountAcl.accountId}
      items={items}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
}
