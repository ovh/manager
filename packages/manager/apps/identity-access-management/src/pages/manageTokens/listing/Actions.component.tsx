import { useTranslation } from 'react-i18next';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export function Actions() {
  const { t } = useTranslation(NAMESPACES.ACTIONS);

  const editHref = '#';
  const deleteHref = '#';
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
  return <ActionMenu id="manage-tokens-actions" items={items} isCompact />;
}
