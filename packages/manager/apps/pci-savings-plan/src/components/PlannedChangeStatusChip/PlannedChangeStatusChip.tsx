import { ODS_SPINNER_SIZE, ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge, OdsSpinner } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SavingsPlanPlanedChangeStatus } from '@/types/api.type';

const PlannedChangeStatusChip = ({ label }: { label: string }) => {
  const { t } = useTranslation('listing');
  const colorByProductStatus: {
    [key in SavingsPlanPlanedChangeStatus]: ODS_BADGE_COLOR;
  } = {
    [SavingsPlanPlanedChangeStatus.REACTIVATE]: ODS_BADGE_COLOR.success,
    [SavingsPlanPlanedChangeStatus.TERMINATE]: ODS_BADGE_COLOR.critical,
  };

  return label ? (
    <OdsBadge
      label={t(label.toLowerCase())}
      color={colorByProductStatus[label as SavingsPlanPlanedChangeStatus]}
    />
  ) : (
    <OdsSpinner size={ODS_SPINNER_SIZE.sm} />
  );
};

export default PlannedChangeStatusChip;
