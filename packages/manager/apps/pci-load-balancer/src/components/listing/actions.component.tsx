import { useHref } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ActionMenu, useProjectUrl } from '@ovh-ux/manager-react-components';
import { TLoadBalancer } from '@/types';

type ActionsComponentProps = {
  loadBalancer: TLoadBalancer;
};

export default function ActionsComponent({
  loadBalancer,
}: Readonly<ActionsComponentProps>) {
  const { t } = useTranslation('');
  const projectUrl = useProjectUrl('public-cloud');

  const loadBalancerDetailHref = useHref(
    `${projectUrl}/octavia-load-balancer/${loadBalancer.region}/${loadBalancer.id}/general-information`,
  );
  const deleteHref = useHref(`./${loadBalancer.id}/delete`);

  const items = [
    {
      id: 0,
      href: loadBalancerDetailHref,
      label: t('octavia_load_balancer_actions_detail'),
    },
    {
      id: 1,
      href: deleteHref,
      label: t('octavia_load_balancer_actions_delete'),
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
