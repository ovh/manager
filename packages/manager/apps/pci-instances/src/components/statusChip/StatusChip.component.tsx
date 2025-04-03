import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsChip,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { TInstanceStatus } from '@/types/instance/entity.type';

const colorBySeverityStatus = {
  success: ODS_THEME_COLOR_INTENT.success,
  error: ODS_THEME_COLOR_INTENT.error,
  warning: ODS_THEME_COLOR_INTENT.warning,
  info: ODS_THEME_COLOR_INTENT.info,
};

const StatusChip = ({ status }: { status: TInstanceStatus }) => {
  const { t, i18n } = useTranslation('status');
  const { label, severity } = status;

  const tooltipContentI18nKey = `pci_instances_tooltip_content_status_${label.toLowerCase()}`;

  const isTooltipDisplayed = useMemo(
    () =>
      i18n.exists(tooltipContentI18nKey, {
        ns: 'status',
      }),
    [i18n, tooltipContentI18nKey],
  );

  const chip = useMemo(
    () => (
      <OsdsChip
        inline
        color={colorBySeverityStatus[severity]}
        data-testid="status-chip"
        className="cursor-default"
      >
        {t(`pci_instances_status_${label.toLowerCase()}`)}
      </OsdsChip>
    ),
    [label, severity, t],
  );

  return isTooltipDisplayed ? (
    <OsdsTooltip>
      {chip}
      <OsdsTooltipContent slot="tooltip-content">
        {t(tooltipContentI18nKey)}
      </OsdsTooltipContent>
    </OsdsTooltip>
  ) : (
    chip
  );
};

export default StatusChip;
