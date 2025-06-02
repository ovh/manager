import { FC, useMemo } from 'react';
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
  const { t, i18n } = useTranslation('status');
  const statusLabel = instance.status.label.toLowerCase();

  const pollingTaskLabel =
    instance.taskState ?? t('common:pci_instances_common_pending');

  const status: TStatusChipStatus = isPolling
    ? { label: pollingTaskLabel, severity: 'default' }
    : {
        ...instance.status,
        label: t(`pci_instances_status_${statusLabel}`),
      };

  const tooltipContentI18nKey = `pci_instances_tooltip_content_status_${statusLabel}`;

  const isTooltipDisplayed = useMemo(
    () =>
      !isPolling &&
      i18n.exists(tooltipContentI18nKey, {
        ns: 'status',
      }),
    [i18n, isPolling, tooltipContentI18nKey],
  );

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
        {...(isTooltipDisplayed && {
          tooltipLabel: tooltipContentI18nKey,
        })}
      />
    </LoadingCell>
  );
};
