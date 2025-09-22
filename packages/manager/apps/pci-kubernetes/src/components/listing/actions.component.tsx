import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ActionMenu } from '@ovh-ux/manager-react-components';

type ActionsComponentProps = {
  kubeId: string;
};

export default function ActionsComponent({ kubeId }: Readonly<ActionsComponentProps>) {
  const { t } = useTranslation('listing');

  const kubeIdHref = useHref(`./${kubeId}`);

  const items = [
    {
      id: 0,
      href: kubeIdHref,
      label: t('kube_list_cluster_manage'),
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
