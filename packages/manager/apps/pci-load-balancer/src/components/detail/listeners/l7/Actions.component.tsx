import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';

export type ActionsComponentProps = {
  l7PoliciesId: string;
};
export default function ActionsComponent({
  l7PoliciesId,
}: Readonly<ActionsComponentProps>) {
  const { t } = useTranslation('octavia-load-balancer-l7');

  const items = [
    {
      id: 0,
      href: useHref(`../${l7PoliciesId}/edit`),
      label: t('octavia_load_balancer_list_l7_policies_actions_edit'),
    },
    {
      id: 1,
      href: useHref(`../${l7PoliciesId}/rules`),
      label: t('octavia_load_balancer_list_l7_policies_actions_manage_rules'),
    },
    {
      id: 2,
      href: useHref(`./${l7PoliciesId}/delete`),
      label: t('octavia_load_balancer_list_l7_policies_actions_delete'),
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
