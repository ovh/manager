import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { VeeamBackupWithIam, ResourceStatus } from '@/data';

const colorByStatus: { [s in ResourceStatus]: ODS_THEME_COLOR_INTENT } = {
  READY: ODS_THEME_COLOR_INTENT.success,
  CREATING: ODS_THEME_COLOR_INTENT.info,
  DISABLED: ODS_THEME_COLOR_INTENT.default,
  DISABLING: ODS_THEME_COLOR_INTENT.default,
  REMOVED: ODS_THEME_COLOR_INTENT.error,
  UPDATING: ODS_THEME_COLOR_INTENT.info,
};

export const StatusCell: React.FC<VeeamBackupWithIam> = ({
  resourceStatus,
}) => {
  const { t } = useTranslation('veeam-backup');
  return (
    <OsdsChip inline color={colorByStatus[resourceStatus]}>
      {t(resourceStatus)}
    </OsdsChip>
  );
};
