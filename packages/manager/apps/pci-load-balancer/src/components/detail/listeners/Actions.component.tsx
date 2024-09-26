import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';

export default function ActionsComponent() {
  const { t } = useTranslation('octavia-load-balancer-listeners');

  const listenerDetail = useHref('');
  const policiesHref = useHref('');
  const deleteHref = useHref('');

  const items = [
    {
      id: 0,
      href: listenerDetail,
      label: t('octavia_load_balancer_listeners_actions_detail'),
    },
    {
      id: 1,
      href: policiesHref,
      label: t('octavia_load_balancer_listeners_actions_policies'),
    },
    {
      id: 2,
      href: deleteHref,
      label: t('octavia_load_balancer_listeners_actions_delete'),
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
