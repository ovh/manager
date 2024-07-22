import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsChip, OsdsSpinner } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SavingsPlanStatus } from '@/types/api.type';

const StatusChip = ({ label }: { label: string }) => {
  const { t } = useTranslation('listing');
  const colorByProductStatus: {
    [key in SavingsPlanStatus]: ODS_THEME_COLOR_INTENT;
  } = {
    [SavingsPlanStatus.ACTIVE]: ODS_THEME_COLOR_INTENT.success,
    [SavingsPlanStatus.PENDING]: ODS_THEME_COLOR_INTENT.warning,
    [SavingsPlanStatus.TERMINATED]: ODS_THEME_COLOR_INTENT.error,
  };

  return label ? (
    <OsdsChip inline color={colorByProductStatus[label as SavingsPlanStatus]}>
      {t(label.toLowerCase() as SavingsPlanStatus)}
    </OsdsChip>
  ) : (
    <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
  );
};

export default StatusChip;
