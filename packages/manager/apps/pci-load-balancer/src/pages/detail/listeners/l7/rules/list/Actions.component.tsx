import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';

export type ActionsComponentProps = {
  l7RulesId: string;
};
export default function ActionsComponent({
  l7RulesId,
}: Readonly<ActionsComponentProps>) {
  const { t } = useTranslation('l7/rules/list');

  const items = [
    {
      id: 0,
      href: useHref(`../${l7RulesId}/edit`),
      label: t('octavia_load_balancer_list_l7_rules_actions_edit'),
    },
    {
      id: 1,
      href: useHref(`./${l7RulesId}/delete`),
      label: t('octavia_load_balancer_list_l7_rules_actions_delete'),
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
