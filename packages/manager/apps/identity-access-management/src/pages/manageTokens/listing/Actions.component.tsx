import { useTranslation } from 'react-i18next';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';

export function Actions() {
  const { t } = useTranslation('manage-tokens');

  const editHref = '#';
  const deleteHref = '#';
  const items: ActionMenuItem[] = [
    {
      id: 0,
      label: t('iam_user_tokens_datagrid_action_edit'),
      href: editHref,
    },
    {
      id: 1,
      label: t('iam_user_tokens_datagrid_action_delete'),
      href: deleteHref,
    },
  ];
  return <ActionMenu id="manage-tokens-actions" items={items} isCompact />;
}
