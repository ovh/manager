import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { InstanceStatus } from '@/data/hooks/instances/useInstances';

const StatusChip = ({ status }: { status: InstanceStatus }) => {
  const { t } = useTranslation('status');

  const colorBySeverityStatus = {
    success: ODS_THEME_COLOR_INTENT.success,
    error: ODS_THEME_COLOR_INTENT.error,
    warning: ODS_THEME_COLOR_INTENT.warning,
    info: ODS_THEME_COLOR_INTENT.info,
  };

  return (
    <OsdsChip inline color={colorBySeverityStatus[status.severity]}>
      {t(status.state)}
    </OsdsChip>
  );
};

export default StatusChip;
