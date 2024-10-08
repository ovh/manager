import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { TInstanceStatus } from '@/data/hooks/instance/useInstances';

const colorBySeverityStatus = {
  success: ODS_THEME_COLOR_INTENT.success,
  error: ODS_THEME_COLOR_INTENT.error,
  warning: ODS_THEME_COLOR_INTENT.warning,
  info: ODS_THEME_COLOR_INTENT.info,
};

const StatusChip = ({ status }: { status: TInstanceStatus }) => {
  const { t } = useTranslation('status');

  return (
    <OsdsChip inline color={colorBySeverityStatus[status.severity]}>
      {t(status.state.toLowerCase())}
    </OsdsChip>
  );
};

export default StatusChip;
