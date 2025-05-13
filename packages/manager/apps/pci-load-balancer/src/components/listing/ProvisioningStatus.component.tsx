import { useTranslation } from 'react-i18next';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { useMemo } from 'react';
import { ODS_CHIP_SIZE, OdsChipAttribute } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { LoadBalancerProvisioningStatusEnum } from '@/api/data/load-balancer';

type ProvisioningStatusComponentProps = {
  status: LoadBalancerProvisioningStatusEnum;
  className?: string;
};

export default function ProvisioningStatusComponent({
  status,
  className,
}: Readonly<ProvisioningStatusComponentProps>) {
  const { t } = useTranslation('load-balancer');

  const chipAttribute: OdsChipAttribute = useMemo(() => {
    switch (status) {
      case LoadBalancerProvisioningStatusEnum.CREATING:
      case LoadBalancerProvisioningStatusEnum.DELETING:
      case LoadBalancerProvisioningStatusEnum.UPDATING:
        return {
          color: ODS_THEME_COLOR_INTENT.warning,
        };
      case LoadBalancerProvisioningStatusEnum.ERROR:
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
      data-testid="ProvisioningStatus_chip"
      size={ODS_CHIP_SIZE.sm}
      {...chipAttribute}
    >
      <b>{t(`octavia_load_balancer_provisioning_status_${status}`)}</b>
    </OsdsChip>
  );
}
