import { FC } from 'react';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ResourceStatus } from '@/types/network.type';

const color = {
  [ResourceStatus.ACTIVE]: ODS_THEME_COLOR_INTENT.success,
  [ResourceStatus.DISABLED]: ODS_THEME_COLOR_INTENT.warning,
};

const StatusInfo: FC<{
  label: string;
  status: ResourceStatus;
}> = ({ label, status }) => (
  <OsdsChip
    className="inline-flex m-3"
    size={ODS_CHIP_SIZE.sm}
    color={color[status]}
  >
    {label}
  </OsdsChip>
);

export default StatusInfo;
