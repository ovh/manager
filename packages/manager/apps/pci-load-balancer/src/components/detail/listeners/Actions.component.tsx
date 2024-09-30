import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';

export type ActionsComponentProps = {
  listenerId: string;
};

export default function ActionsComponent({
  listenerId,
}: Readonly<ActionsComponentProps>) {
  const { t } = useTranslation('octavia-load-balancer-listeners');
  const listenerEdit = useHref(`../${listenerId}/edit`);
  const policiesHref = useHref(`../${listenerId}/l7/list`);
  const deleteHref = useHref(`${listenerId}/delete`);

  const items = [
    {
      id: 0,
      href: listenerEdit,
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
