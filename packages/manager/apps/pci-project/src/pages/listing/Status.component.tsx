import { OdsBadge } from '@ovhcloud/ods-components/react';
import { OdsBadgeColor } from '@ovhcloud/ods-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TProjectWithService } from '@/data/types/project.type';

type StatusComponentProps = {
  project: TProjectWithService;
};

const isUnpaidAndNotSuspended = (project: TProjectWithService): boolean =>
  project.isUnpaid && project.status !== 'suspended';

export default function StatusComponent({
  project,
}: Readonly<StatusComponentProps>) {
  const { t } = useTranslation('listing');

  const badgeColor = useMemo<OdsBadgeColor>(() => {
    if (isUnpaidAndNotSuspended(project)) {
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
    return 'information';
  }, [project]);

  return (
    <OdsBadge
      color={badgeColor}
      data-testid="status_badge"
      label={t(
        isUnpaidAndNotSuspended(project)
          ? `pci_projects_status_pendingDebt`
          : `pci_projects_status_${project.status}`,
      )}
    />
  );
}
