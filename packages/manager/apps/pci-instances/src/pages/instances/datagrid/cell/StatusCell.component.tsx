import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { LoadingCell } from '@/components/datagrid/cell/LoadingCell.component';
import StatusChip, {
  TStatusChipStatus,
} from '@/components/statusChip/StatusChip.component';
import { TInstance } from '@/types/instance/entity.type';

type TStatusCellProps = {
  instance: TInstance;
  isLoading: boolean;
  isPolling: boolean;
};

export const StatusCell: FC<TStatusCellProps> = ({
  isLoading,
  instance,
  isPolling,
}) => {
  const { t } = useTranslation('status');

  const pollingTaskLabel =
    instance.taskState ?? t('common:pci_instances_common_pending');

  const status: TStatusChipStatus = isPolling
    ? { label: pollingTaskLabel, severity: 'default' }
    : {
        ...instance.status,
        label: t(`pci_instances_status_${instance.status.label.toLowerCase()}`),
      };

  return (
    <LoadingCell isLoading={isLoading}>
      <StatusChip
        status={status}
        {...(isPolling && {
          icon: (
            <OsdsIcon
              name={ODS_ICON_NAME.CLOCK_WAIT}
              size={ODS_ICON_SIZE.xxs}
            />
          ),
        })}
      />
    </LoadingCell>
  );
};
