import { OdsBadgeColor } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TSnapshot } from '@/api/data/snapshots';

type StatusComponentProps = {
  status: TSnapshot['status'];
};

export default function StatusComponent({
  status,
}: Readonly<StatusComponentProps>) {
  const { t } = useTranslation('volumes');

  const statusGroup = ['error', 'error_deleting'].includes(status)
    ? 'ERROR'
    : status.toUpperCase();

  const [badgeColor, setBadgeColor] = useState<OdsBadgeColor>('information');

  useEffect(() => {
    switch (statusGroup) {
      case 'AVAILABLE':
        setBadgeColor('success');
        break;
      case 'CREATING':
      case 'DELETING':
        setBadgeColor('warning');
        break;
      case 'ERROR':
        setBadgeColor('critical');
        break;
      default:
        setBadgeColor('information');
        break;
    }
  }, [status]);

  return (
    <OdsBadge
      className="font-bold"
      color={badgeColor}
      data-testid="status_badge"
      label={t(`pci_projects_project_storages_snapshots_status_${statusGroup}`)}
    />
  );
}
