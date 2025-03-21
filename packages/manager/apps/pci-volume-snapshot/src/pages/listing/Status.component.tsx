import { OdsBadge } from '@ovhcloud/ods-components/react';
import { OdsBadgeColor } from '@ovhcloud/ods-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TSnapshot } from '@/api/api.types';

type StatusComponentProps = {
  status: TSnapshot['status'];
};

export default function StatusComponent({
  status,
}: Readonly<StatusComponentProps>) {
  const { t } = useTranslation('volumes');

  const [badgeColor, statusGroup] = useMemo<[OdsBadgeColor, string]>(() => {
    const group = ['error', 'error_deleting'].includes(status)
      ? 'ERROR'
      : status.toUpperCase();

    switch (group) {
      case 'AVAILABLE':
        return ['success', group];
      case 'CREATING':
      case 'DELETING':
        return ['warning', group];
      case 'ERROR':
        return ['critical', group];
      default:
        return ['information', group];
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
