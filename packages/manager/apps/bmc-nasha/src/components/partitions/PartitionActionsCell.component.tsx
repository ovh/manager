import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '@ovh-ux/muk';

import { APP_NAME } from '@/Tracking.constants';
import { PREFIX_TRACKING_DASHBOARD_PARTITIONS } from '@/constants/nasha.constants';

type PartitionActionsCellProps = {
  partitionName: string;
};

export default function PartitionActionsCell({ partitionName }: PartitionActionsCellProps) {
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['partitions']);

  const handlePartitionAction = (action: string) => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, PREFIX_TRACKING_DASHBOARD_PARTITIONS, action],
    });

    switch (action) {
      case 'show':
        navigate(`../partition/${partitionName}`);
        break;
      case 'snapshots':
        navigate(`../partition/${partitionName}/snapshots`);
        break;
      case 'accesses':
        navigate(`../partition/${partitionName}/accesses`);
        break;
      case 'edit-size':
        navigate(`../partition/${partitionName}/edit-size`);
        break;
      case 'zfs-options':
        navigate(`../partition/${partitionName}/zfs-options`);
        break;
      case 'delete':
        navigate(`../partitions/${partitionName}/delete`);
        break;
      default:
        break;
    }
  };

  return (
    <ActionMenu
      id={`partition-actions-${partitionName}`}
      items={[
        {
          id: 1,
          label: t('partitions:actions.show'),
          onClick: () => handlePartitionAction('show'),
        },
        {
          id: 2,
          label: t('partitions:actions.snapshots'),
          onClick: () => handlePartitionAction('snapshots'),
        },
        {
          id: 3,
          label: t('partitions:actions.access'),
          onClick: () => handlePartitionAction('accesses'),
        },
        {
          id: 4,
          label: t('partitions:actions.edit_size'),
          onClick: () => handlePartitionAction('edit-size'),
        },
        {
          id: 5,
          label: t('partitions:actions.zfs_options'),
          onClick: () => handlePartitionAction('zfs-options'),
        },
        {
          id: 6,
          label: t('partitions:actions.delete'),
          onClick: () => handlePartitionAction('delete'),
        },
      ]}
    />
  );
}
