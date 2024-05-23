import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsChip, OsdsSpinner } from '@ovhcloud/ods-components/react';
import React from 'react';
import { ResourceStatus } from '@/api/api.type';
import { useTranslate } from '@/utils/translation';

const StatusChip = ({ label }: { label: string }) => {
  const { t } = useTranslate('pci-rancher/listing');
  const colorByProductStatus: {
    [key in ResourceStatus]: ODS_THEME_COLOR_INTENT;
  } = {
    [ResourceStatus.READY]: ODS_THEME_COLOR_INTENT.success,
    [ResourceStatus.DISABLED]: ODS_THEME_COLOR_INTENT.error,
    [ResourceStatus.UPDATING]: ODS_THEME_COLOR_INTENT.info,
    [ResourceStatus.ERROR]: ODS_THEME_COLOR_INTENT.error,
    [ResourceStatus.CREATING]: ODS_THEME_COLOR_INTENT.info,
    [ResourceStatus.DELETING]: ODS_THEME_COLOR_INTENT.info,
  };

  return label ? (
    <OsdsChip inline color={colorByProductStatus[label as ResourceStatus]}>
      {t(label as ResourceStatus)}
    </OsdsChip>
  ) : (
    <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
  );
};

export default StatusChip;
