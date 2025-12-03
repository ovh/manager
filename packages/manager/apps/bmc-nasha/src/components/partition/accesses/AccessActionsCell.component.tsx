import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '@ovh-ux/muk';

import { APP_NAME } from '@/Tracking.constants';
import { urls } from '@/routes/Routes.constants';

type AccessActionsCellProps = {
  ip: string;
};

export default function AccessActionsCell({ ip }: AccessActionsCellProps) {
  const { serviceName, partitionName } = useParams<{
    serviceName: string;
    partitionName: string;
  }>();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['partition']);

  const handleDelete = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'accesses', 'delete'],
    });
    navigate(`delete/${encodeURIComponent(ip)}`);
  };

  return (
    <ActionMenu
      id={`access-actions-${ip}`}
      items={[
        {
          id: 1,
          label: t('partition:accesses.actions.delete'),
          onClick: handleDelete,
        },
      ]}
    />
  );
}
