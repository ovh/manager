import { useHref } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { TLoadBalancer } from '@/api/data/load-balancer';

type ActionsComponentProps = {
  loadBalancer: TLoadBalancer;
};

export default function ActionsComponent({
  loadBalancer,
}: Readonly<ActionsComponentProps>) {
  const { t } = useTranslation('load-balancer');
  const { trackClick } = useOvhTracking();

  const loadBalancerDetailHref = useHref(
    `../${loadBalancer.region}/${loadBalancer.id}`,
  );
  const deleteHref = useHref(
    `./${loadBalancer.region}/${loadBalancer.id}/delete`,
  );

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
      onClick: () =>
        trackClick({
          actions: ['delete_loadbalancer', loadBalancer.region],
          actionType: 'action',
          buttonType: ButtonType.button,
          location: PageLocation.datagrid,
        }),
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
