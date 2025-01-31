import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import {
  OdsBadge,
  OdsPopover,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useFormattedDate } from '@/hooks/useFormattedDate';

export const COLD_ARCHIVE_CONTAINER_STATUS_LABEL = {
  ARCHIVED: 'success',
  ARCHIVING: 'information',
  DELETING: 'warning',
  FLUSHED: 'critical',
  NONE: 'neutral',
  RESTORED: 'success',
  RESTORING: 'information',
};

export const COLD_ARCHIVE_CONTAINER_STATUS = {
  ARCHIVED: 'archived',
  ARCHIVING: 'archiving',
  DELETING: 'deleting',
  FLUSHED: 'flushed',
  NONE: 'none',
  RESTORED: 'restored',
  RESTORING: 'restoring',
};

export default function StatusComponent({
  status,
  name,
  automaticDeletionAt,
}: Readonly<{ status: string; name: string; automaticDeletionAt: string }>) {
  const { t } = useTranslation('cold-archive, cold-archive/containers');
  return (
    <DataGridTextCell>
      <OdsBadge
        className="font-bold"
        color={COLD_ARCHIVE_CONTAINER_STATUS_LABEL[status.toUpperCase()]}
        label={t(
          `cold-archive:pci_projects_project_storages_containers_status_${status}`,
        )}
      />
      {status === COLD_ARCHIVE_CONTAINER_STATUS.RESTORED &&
        automaticDeletionAt && (
          <>
            <OdsText
              preset="span"
              className="block mt-4"
              id={`popover-${name}`}
            >
              {t(
                'cold-archive/containers:pci_projects_project_storages_cold_archive_containers_status_restore_date',
                {
                  date: useFormattedDate(automaticDeletionAt, 'Pp'),
                },
              )}
            </OdsText>
            <OdsTooltip triggerId={`popover-${name}`} withArrow>
              {t(
                'cold-archive/containers:pci_projects_project_storages_cold_archive_containers_status_restore_date_tooltip',
              )}
            </OdsTooltip>
          </>
        )}
    </DataGridTextCell>
  );
}
