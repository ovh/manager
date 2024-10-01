import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';

export default function ActionsComponent() {
  const { t } = useTranslation('octavia-load-balancer-pools');

  const poolEditHref = useHref(``);
  const membersHref = useHref(``);
  const deleteHref = useHref(``);

  const items = [
    {
      id: 0,
      href: poolEditHref,
      label: t('octavia_load_balancer_pools_actions_edit'),
    },
    {
      id: 1,
      href: membersHref,
      label: t('octavia_load_balancer_pools_actions_manage_members'),
    },
    {
      id: 2,
      href: deleteHref,
      label: t('octavia_load_balancer_pools_actions_delete'),
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
