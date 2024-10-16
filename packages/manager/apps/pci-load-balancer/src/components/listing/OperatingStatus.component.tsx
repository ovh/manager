import { useTranslation } from 'react-i18next';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { useMemo } from 'react';
import { ODS_CHIP_SIZE, OdsChipAttribute } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { LoadBalancerOperatingStatusEnum } from '@/api/data/load-balancer';

type OperatingStatusComponentProps = {
  status: LoadBalancerOperatingStatusEnum;
  className?: string;
};

export default function OperatingStatusComponent({
  status,
  className,
}: Readonly<OperatingStatusComponentProps>) {
  const { t } = useTranslation('load-balancer');

  const chipAttribute: OdsChipAttribute = useMemo(() => {
    switch (status) {
      case LoadBalancerOperatingStatusEnum.OFFLINE:
      case LoadBalancerOperatingStatusEnum.DEGRADED:
      case LoadBalancerOperatingStatusEnum.DRAINING:
      case LoadBalancerOperatingStatusEnum.NO_MONITOR:
        return {
          color: ODS_THEME_COLOR_INTENT.warning,
        };
      case LoadBalancerOperatingStatusEnum.ERROR:
        return {
          color: ODS_THEME_COLOR_INTENT.error,
        };
      default:
        return {
          color: ODS_THEME_COLOR_INTENT.success,
        };
    }
  }, [status]);

  return (
    <OsdsChip
      className={className}
      data-testid="OperatingStatus_chip"
      size={ODS_CHIP_SIZE.sm}
      {...chipAttribute}
    >
      <b>{t(`octavia_load_balancer_operating_status_${status}`)}</b>
    </OsdsChip>
  );
}
