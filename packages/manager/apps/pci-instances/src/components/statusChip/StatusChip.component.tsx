import { useTranslation } from 'react-i18next';
import { FC, useMemo } from 'react';
import {
  BADGE_COLOR,
  Badge,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

const COLOR_BY_SEVERITY_STATUS = {
  success: BADGE_COLOR.success,
  error: BADGE_COLOR.critical,
  warning: BADGE_COLOR.warning,
  info: BADGE_COLOR.information,
  default: BADGE_COLOR.neutral,
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
      <Badge
        color={COLOR_BY_SEVERITY_STATUS[severity]}
        data-testid="status-chip"
        className="h-[26px]"
      >
        <div className="flex items-center gap-1">
          {icon}
          <span className="first-letter:uppercase text-nowrap">{label}</span>
        </div>
      </Badge>
    ),
    [icon, label, severity],
  );

  return tooltipLabel ? (
    <Tooltip position="bottom">
      <TooltipTrigger asChild>{chip}</TooltipTrigger>
      <TooltipContent slot="tooltip-content" className="break-keep">
        {t(tooltipLabel)}
      </TooltipContent>
    </Tooltip>
  ) : (
    chip
  );
};

export default StatusChip;
