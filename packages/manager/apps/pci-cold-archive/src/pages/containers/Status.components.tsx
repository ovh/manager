import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { OdsBadge, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useFormattedDate } from '@/hooks/useFormattedDate';
import { COLD_ARCHIVE_CONTAINER_STATUS } from '@/constants';

export const COLD_ARCHIVE_CONTAINER_STATUS_LABEL = {
  ARCHIVED: 'success',
  ARCHIVING: 'information',
  DELETING: 'warning',
  FLUSHED: 'critical',
  NONE: 'neutral',
  RESTORED: 'success',
  RESTORING: 'information',
};

export default function StatusComponent({
  status,
  name,
  automaticDeletionAt,
}: Readonly<{ status: string; name: string; automaticDeletionAt: string }>) {
  const { t } = useTranslation(['cold-archive', 'containers']);

  return (
    <DataGridTextCell>
      <OdsBadge
        color={COLD_ARCHIVE_CONTAINER_STATUS_LABEL[status.toUpperCase()]}
        label={t(`pci_projects_project_storages_containers_status_${status}`)}
        data-testid="status_badge"
      />
      {status === COLD_ARCHIVE_CONTAINER_STATUS.RESTORED &&
        automaticDeletionAt && (
          <>
            <OdsText
              preset="span"
              className="block mt-4"
              id={`popover-${name}`}
              data-testid="status_restore-date_text"
            >
              {t(
                'containers:pci_projects_project_storages_cold_archive_containers_status_restore_date',
                {
                  date: useFormattedDate(automaticDeletionAt, 'P p'),
                },
              )}
            </OdsText>
            <OdsTooltip
              data-testid="status_restore-date_tooltip"
              triggerId={`popover-${name}`}
              withArrow
            >
              {t(
                'containers:pci_projects_project_storages_cold_archive_containers_status_restore_date_tooltip',
              )}
            </OdsTooltip>
          </>
        )}
    </DataGridTextCell>
  );
}
