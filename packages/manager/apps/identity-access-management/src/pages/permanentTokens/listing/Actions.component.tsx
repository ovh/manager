import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { IamUserToken } from '@/data/api/iam-users';
import { subRoutes } from '@/routes/routes.constant';

export function Actions({ token }: { token: IamUserToken }) {
  const { t } = useTranslation(NAMESPACES.ACTIONS);

  const editHref = useHref(
    subRoutes.permanentTokensEdit.replace(':tokenId', token.name),
  );
  const deleteHref = useHref(
    subRoutes.permanentTokensDelete.replace(':tokenId', token.name),
  );
  const items: ActionMenuItem[] = [
    {
      id: 0,
      label: t('modify'),
      href: editHref,
    },
    {
      id: 1,
      label: t('delete'),
      href: deleteHref,
    },
  ];
  return (
    <ActionMenu
      id={`manage-tokens-actions_${token.name}`}
      items={items}
      isCompact
    />
  );
}
