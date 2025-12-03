import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '@ovh-ux/muk';

import { APP_NAME } from '@/Tracking.constants';
import { urls } from '@/routes/Routes.constants';

type SnapshotActionsCellProps = {
  snapshotName: string;
  isCustom: boolean;
};

export default function SnapshotActionsCell({ snapshotName, isCustom }: SnapshotActionsCellProps) {
  const { serviceName, partitionName } = useParams<{
    serviceName: string;
    partitionName: string;
  }>();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['partition']);

  if (!isCustom) return null;

  const handleDelete = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'snapshots', 'delete'],
    });
    navigate(`delete/${encodeURIComponent(snapshotName)}`);
  };

  return (
    <ActionMenu
      id={`snapshot-actions-${snapshotName}`}
      items={[
        {
          id: 1,
          label: t('partition:snapshots.actions.delete'),
          onClick: handleDelete,
        },
      ]}
    />
  );
}
