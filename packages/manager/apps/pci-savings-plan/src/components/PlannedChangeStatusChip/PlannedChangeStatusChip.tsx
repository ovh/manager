import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsChip, OsdsSpinner } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SavingsPlanPlanedChangeStatus } from '@/types/api.type';

const PlannedChangeStatusChip = ({ label }: { label: string }) => {
  const { t } = useTranslation('listing');
  const colorByProductStatus: {
    [key in SavingsPlanPlanedChangeStatus]: ODS_THEME_COLOR_INTENT;
  } = {
    [SavingsPlanPlanedChangeStatus.REACTIVATE]: ODS_THEME_COLOR_INTENT.success,
    [SavingsPlanPlanedChangeStatus.TERMINATE]: ODS_THEME_COLOR_INTENT.error,
  };

  return label ? (
    <OsdsChip
      inline
      color={colorByProductStatus[label as SavingsPlanPlanedChangeStatus]}
    >
      {t(label.toLowerCase() as SavingsPlanPlanedChangeStatus)}
    </OsdsChip>
  ) : (
    <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
  );
};

export default PlannedChangeStatusChip;
