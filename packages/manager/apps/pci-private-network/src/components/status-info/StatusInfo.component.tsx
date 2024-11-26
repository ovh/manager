import { FC } from 'react';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ResourceStatus } from '@/types/network.type';

const StatusInfo: FC<{
  label: ResourceStatus;
}> = ({ label }) => {
  const { t } = useTranslation('listing');
  const color = {
    [ResourceStatus.ACTIVE]: ODS_THEME_COLOR_INTENT.success,
    [ResourceStatus.DISABLED]: ODS_THEME_COLOR_INTENT.warning,
  };

  return (
    <OsdsChip
      className="inline-flex m-3"
      size={ODS_CHIP_SIZE.sm}
      color={color[label]}
    >
      {t(label)}
    </OsdsChip>
  );
};

export default StatusInfo;
