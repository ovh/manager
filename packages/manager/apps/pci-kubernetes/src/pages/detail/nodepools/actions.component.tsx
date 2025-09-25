import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ActionMenu } from '@ovh-ux/manager-react-components';

import { TClusterNodePool } from '@/api/data/node-pools';

type ActionsComponentProps = {
  pool: TClusterNodePool;
};

export default function ActionsComponent({ pool }: Readonly<ActionsComponentProps>) {
  const { t } = useTranslation('node-pool');

  const scaleHref = useHref(`./scale?nodePoolId=${pool.id}`);
  const nodesListHref = useHref(`./${pool.id}/nodes`);
  const deleteHref = useHref(`./delete?nodePoolId=${pool.id}`);

  const items = [
    {
      id: 0,
      href: scaleHref,
      label: t('kube_node_pool_scale'),
      disabled: pool.status !== 'READY',
    },
    {
      id: 1,
      href: nodesListHref,
      label: t('kube_node_pool_nodes'),
      disabled: !['ERROR', 'READY'].includes(pool.status),
    },
    {
      id: 2,
      href: deleteHref,
      label: t('kube_node_pool_delete'),
      disabled: !['ERROR', 'READY'].includes(pool.status),
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
