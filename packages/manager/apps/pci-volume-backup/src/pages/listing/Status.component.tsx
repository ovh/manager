import { OdsBadge } from '@ovhcloud/ods-components/react';
import { OdsBadgeColor } from '@ovhcloud/ods-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TBackup } from '@/data/api/api.types';

type StatusComponentProps = {
  status: TBackup['status'];
};

export default function StatusComponent({
  status,
}: Readonly<StatusComponentProps>) {
  const { t } = useTranslation('listing');

  const badgeColor = useMemo<OdsBadgeColor>(() => {
    switch (status) {
      case 'error':
        return 'critical';
      case 'creating':
      case 'deleting':
      case 'restoring':
        return 'warning';
      case 'ok':
        return 'success';
      default:
        return 'information';
    }
  }, [status]);

  return (
    <OdsBadge
      color={badgeColor}
      data-testid="status_badge"
      label={t(
        `pci_projects_project_storages_volume_backup_list_status_${status}`,
      )}
    />
  );
}
