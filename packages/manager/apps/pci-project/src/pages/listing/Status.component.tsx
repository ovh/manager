import { OdsBadge } from '@ovhcloud/ods-components/react';
import { OdsBadgeColor } from '@ovhcloud/ods-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TProjectWithService } from '@/data/types/project.type';

type StatusComponentProps = {
  project: TProjectWithService;
};

export default function StatusComponent({
  project,
}: Readonly<StatusComponentProps>) {
  const { t } = useTranslation('listing');

  const isUnpaidAndNotSuspended =
    project.isUnpaid && project.status !== 'suspended';

  const badgeColor = useMemo<OdsBadgeColor>(() => {
    if (isUnpaidAndNotSuspended) {
      return 'critical';
    }

    switch (project.status) {
      case 'deleted':
      case 'suspended':
        return 'critical';
      case 'deleting':
        return 'warning';
      case 'ok':
        return 'success';
      default:
        return 'information';
    }
  }, [project, isUnpaidAndNotSuspended]);

  return (
    <OdsBadge
      color={badgeColor}
      data-testid="status_badge"
      label={t(
        isUnpaidAndNotSuspended
          ? `pci_projects_status_pendingDebt`
          : `pci_projects_status_${project.status}`,
      )}
    />
  );
}
