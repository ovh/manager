import { ODS_SPINNER_SIZE, ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge, OdsSpinner } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SavingsPlanStatus } from '@/types/api.type';

const StatusChip = ({ label }: { label: string }) => {
  const { t } = useTranslation('listing');
  const colorByProductStatus: {
    [key in SavingsPlanStatus]: ODS_BADGE_COLOR;
  } = {
    [SavingsPlanStatus.ACTIVE]: ODS_BADGE_COLOR.success,
    [SavingsPlanStatus.PENDING]: ODS_BADGE_COLOR.warning,
    [SavingsPlanStatus.TERMINATED]: ODS_BADGE_COLOR.critical,
  };

  return label ? (
    <OdsBadge
      color={colorByProductStatus[label as SavingsPlanStatus]}
      label={t(label.toLowerCase() as SavingsPlanStatus)}
    />
  ) : (
    <OdsSpinner size={ODS_SPINNER_SIZE.sm} />
  );
};

export default StatusChip;
