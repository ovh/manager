import { useTranslation } from 'react-i18next';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { useMemo } from 'react';
import { OdsChipAttribute } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

type OperatingStatusComponentProps = {
  operatingStatus: string;
};

export default function OperatingStatusComponent({
  operatingStatus,
}: Readonly<OperatingStatusComponentProps>) {
  const { t } = useTranslation('');
  const chipAttribute: OdsChipAttribute = useMemo(() => {
    switch (operatingStatus) {
      case 'offline':
      case 'degraded':
      case 'draining':
      case 'noMonitor':
        return {
          color: ODS_THEME_COLOR_INTENT.warning,
        };
      case 'error':
        return {
          color: ODS_THEME_COLOR_INTENT.error,
        };
      default:
        return {
          color: ODS_THEME_COLOR_INTENT.success,
        };
    }
  }, [operatingStatus]);

  return (
    <OsdsChip
      className="w-fit flex mx-auto"
      {...chipAttribute}
      data-testid="OperatingStatus_chip"
    >
      {t(`octavia_load_balancer_operating_status_${operatingStatus}`)}
    </OsdsChip>
  );
}
