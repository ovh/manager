import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ActionMenu } from '@ovh-ux/manager-react-components';

import { TNode } from '@/api/data/nodes';

type ActionsComponentProps = {
  node: TNode;
};

export default function ActionsComponent({ node }: Readonly<ActionsComponentProps>) {
  const { t: tListing } = useTranslation('listing');
  const { t: tKubeNodes } = useTranslation('kube-nodes');

  const deleteHref = useHref(`./${node.id}/delete`);
  const switchToMonthlyHref = useHref(`./billing-type?nodeId=${node.id}`);

  let items = [
    {
      id: node.canSwitchToMonthly ? 1 : 0,
      href: deleteHref,
      label: tListing('kube_common_delete'),
    },
  ];

  if (node.canSwitchToMonthly) {
    items = [
      {
        id: 0,
        href: switchToMonthlyHref,
        label: tKubeNodes('kube_nodes_switch_to_monthly_billing_title'),
      },
      ...items,
    ];
  }

  return <ActionMenu items={items} isCompact />;
}
