import { useTranslation } from 'react-i18next';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { useEffect, useMemo, useState } from 'react';
import { OdsChipAttribute } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

type ProvisioningStatusComponentProps = {
  provisioningStatus: string;
};

export default function ProvisioningStatusComponent({
  provisioningStatus,
}: Readonly<ProvisioningStatusComponentProps>) {
  const { t } = useTranslation('');
  const chipAttribute: OdsChipAttribute = useMemo(() => {
    switch (provisioningStatus) {
      case 'creating':
      case 'deleting':
      case 'updating':
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
  }, [provisioningStatus]);

  return (
    <OsdsChip
      className="w-fit flex mx-auto"
      {...chipAttribute}
      data-testid="ProvisioningStatus_chip"
    >
      {t(`octavia_load_balancer_provisioning_status_${provisioningStatus}`)}
    </OsdsChip>
  );
}
