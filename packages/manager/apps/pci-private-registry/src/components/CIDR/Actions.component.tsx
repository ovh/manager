import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TIPRestrictionsData } from '@/types';

export default function ActionComponent({
  cidr,
}: {
  cidr: TIPRestrictionsData;
}) {
  const { t } = useTranslation(['ip-restrictions']);
  const navigate = useNavigate();

  const items = [
    {
      id: 0,
      label: t('ip_restrictions_delete_block'),
      disabled: false,
      onClick: () => {
        navigate(`./delete`, { state: { cidr } });
      },
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
