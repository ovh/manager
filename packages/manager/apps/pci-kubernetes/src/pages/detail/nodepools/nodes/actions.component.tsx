import { useHref } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovhcloud/manager-components';
import { TNode } from '@/api/data/nodes';

type ActionsComponentProps = {
  node: TNode;
};

export default function ActionsComponent({
  node,
}: Readonly<ActionsComponentProps>) {
  const { t: tListing } = useTranslation('listing');

  const deleteHref = useHref(`./${node.id}/delete`);

  const items = [
    {
      id: 0,
      href: deleteHref,
      label: tListing('kube_common_delete'),
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
