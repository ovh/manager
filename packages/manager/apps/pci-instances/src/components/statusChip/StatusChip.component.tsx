import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsChip,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { FC, useMemo } from 'react';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';

const COLOR_BY_SEVERITY_STATUS = {
  success: ODS_THEME_COLOR_INTENT.success,
  error: ODS_THEME_COLOR_INTENT.error,
  warning: ODS_THEME_COLOR_INTENT.warning,
  info: ODS_THEME_COLOR_INTENT.info,
  default: ODS_THEME_COLOR_INTENT.default,
} as const;

export type TStatusChipSeverity = keyof typeof COLOR_BY_SEVERITY_STATUS;
export type TStatusChipStatus = {
  label: string;
  severity: TStatusChipSeverity;
};

type TStatusChipProps = {
  status: TStatusChipStatus;
  icon?: JSX.Element;
  tooltipLabel?: string;
};

const StatusChip: FC<TStatusChipProps> = ({ status, icon, tooltipLabel }) => {
  const { t } = useTranslation('status');
  const { label, severity } = status;

  const chip = useMemo(
    () => (
      <OsdsChip
        size={ODS_CHIP_SIZE.sm}
        inline
        color={COLOR_BY_SEVERITY_STATUS[severity]}
        data-testid="status-chip"
        className="cursor-default rounded-[--ods-border-radius-sm] h-[26px] min-w-max"
      >
        <div className="flex items-center gap-1">
          {icon}
          <span className="first-letter:uppercase">{label}</span>
        </div>
      </OsdsChip>
    ),
    [icon, label, severity],
  );

  return tooltipLabel ? (
    <OsdsTooltip>
      {chip}
      <OsdsTooltipContent slot="tooltip-content" className="break-keep">
        {t(tooltipLabel)}
      </OsdsTooltipContent>
    </OsdsTooltip>
  ) : (
    chip
  );
};

export default StatusChip;
