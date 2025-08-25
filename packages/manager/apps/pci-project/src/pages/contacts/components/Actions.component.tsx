import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { AccountAcl } from '@/data/api/acl';
import { urls } from '@/routes/routes.constant';

type ActionsProps = {
  accountAcl: AccountAcl;
};

const getDeleteModalUrl = (accountId: string) => {
  return urls.contactAndRightsDelete.replace(
    ':accountId',
    encodeURIComponent(accountId),
  );
};

export default function Actions({ accountAcl }: Readonly<ActionsProps>) {
  const { t } = useTranslation(['contacts']);
  const deleteAclHref = useHref(`./${getDeleteModalUrl(accountAcl.accountId)}`);
  const items = [
    {
      id: 1,
      label: t('delete'),
      href: deleteAclHref,
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
