import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';

export type ActionsComponentProps = {
  memberId: string;
};
export default function ActionsComponent({
  memberId,
}: Readonly<ActionsComponentProps>) {
  const { t } = useTranslation('pools/members/list');

  const items = [
    {
      id: 0,
      href: useHref(`./${memberId}/edit`),
      label: t('octavia_load_balancer_pools_detail_members_edit'),
    },
    {
      id: 1,
      href: useHref(`./${memberId}/delete`),
      label: t('octavia_load_balancer_pools_detail_members_delete'),
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
