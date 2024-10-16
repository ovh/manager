import { ActionMenu } from '@ovh-ux/manager-react-components';
import {
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { TLoadBalancerListener } from '@/api/data/load-balancer';

export type ActionsComponentProps = {
  listener: TLoadBalancerListener;
};

export default function ActionsComponent({
  listener,
}: Readonly<ActionsComponentProps>) {
  const { id, protocol } = listener;

  const { t } = useTranslation('listeners');
  const listenerEdit = useHref(`../${id}/edit`);
  const policiesHref = useHref(`../${id}/l7/list`);
  const deleteHref = useHref(`${id}/delete`);

  const isPoliciesManagementAvailableForListener = protocol === 'http';

  const items = [
    {
      id: 0,
      href: listenerEdit,
      label: t('octavia_load_balancer_listeners_actions_detail'),
    },
    {
      id: 1,
      href: policiesHref,
      label: (
        <>
          {isPoliciesManagementAvailableForListener ? (
            t('octavia_load_balancer_listeners_actions_policies')
          ) : (
            /**
             * The OsdsTooltip is not working within and OsdsMenu !!
             */
            <OsdsTooltip>
              {t('octavia_load_balancer_listeners_actions_policies')}
              <OsdsTooltipContent slot="tooltip-content">
                {t('octavia_load_balancer_instances_table_pools_tooltip')}
              </OsdsTooltipContent>
            </OsdsTooltip>
          )}
        </>
      ),
      disabled: !isPoliciesManagementAvailableForListener,
    },
    {
      id: 2,
      href: deleteHref,
      label: t('octavia_load_balancer_listeners_actions_delete'),
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
