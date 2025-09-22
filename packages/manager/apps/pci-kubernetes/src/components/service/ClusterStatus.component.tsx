import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsChipAttribute } from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';

type ClusterStatusProps = {
  status: string;
};

export default function ClusterStatus({ status }: Readonly<ClusterStatusProps>) {
  const { i18n, t } = useTranslation('service');

  const [chipAttribute, setChipAttribute] = useState<OdsChipAttribute>({
    color: ODS_THEME_COLOR_INTENT.success,
  });

  useEffect(() => {
    switch (status) {
      case 'READY':
        setChipAttribute({
          color: ODS_THEME_COLOR_INTENT.success,
        });
        break;
      case 'INSTALLING':
      case 'DELETING':
      case 'UPDATING':
      case 'RESETTING':
      case 'SUSPENDING':
      case 'MAINTENANCE':
      case 'REOPENING':
      case 'REDEPLOYING':
        setChipAttribute({
          color: ODS_THEME_COLOR_INTENT.warning,
        });
        break;
      case 'ERROR':
      case 'USER_ERROR':
      case 'USER_QUOTA_ERROR':
      case 'SUSPENDED':
        setChipAttribute({
          color: ODS_THEME_COLOR_INTENT.error,
        });
        break;
      default:
        setChipAttribute({
          color: ODS_THEME_COLOR_INTENT.info,
        });
        break;
    }
  }, [status]);

  const getStatusLabel = (st: string) =>
    i18n.exists(`service:kube_service_cluster_status_${st}`)
      ? t(`kube_service_cluster_status_${st}`)
      : '';

  return (
    <OsdsChip {...chipAttribute} className="w-fit" data-testid="clusterStatus-chip">
      {getStatusLabel(status) || status}
    </OsdsChip>
  );
}
