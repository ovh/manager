import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { TLoadBalancerPool } from '@/api/data/pool';

type ActionsComponentProps = {
  pool: TLoadBalancerPool;
};

export default function ActionsComponent({ pool }: ActionsComponentProps) {
  const { t } = useTranslation('pools');

  const poolEditHref = useHref(`../${pool.id}/edit`);
  const membersHref = useHref(``);
  const deleteHref = useHref(
    `delete?poolId=${pool?.id}&poolName=${pool?.name}`,
  );

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
