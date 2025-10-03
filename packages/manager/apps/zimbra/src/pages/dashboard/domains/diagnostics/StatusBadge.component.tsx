import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, JSX as Ods } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { StyleReactProps } from '@ovhcloud/ods-components/react/dist/types/react-component-lib/interfaces';

import { DomainDiagnosisTestStatusEnum } from '@/data/api';

const getStatusBadgeColor = (status: DomainDiagnosisTestStatusEnum): ODS_BADGE_COLOR => {
  switch (status) {
    case DomainDiagnosisTestStatusEnum.OK:
      return ODS_BADGE_COLOR.success;
    case DomainDiagnosisTestStatusEnum.ERROR:
      return ODS_BADGE_COLOR.critical;
    case DomainDiagnosisTestStatusEnum.WARNING:
    case DomainDiagnosisTestStatusEnum.DISABLED:
      return ODS_BADGE_COLOR.warning;
    default:
      return ODS_BADGE_COLOR.neutral;
  }
};

type StatusBadgeProps = StyleReactProps &
  Omit<Ods.OdsBadge, 'label' | 'color'> & {
    status: DomainDiagnosisTestStatusEnum;
  };

const StatusBadge = ({ status, ...props }: StatusBadgeProps) => {
  const { t } = useTranslation('domains/diagnostic');
  return (
    <OdsBadge
      color={getStatusBadgeColor(status)}
      label={t(`zimbra_domain_diagnostic_status_${status.toLowerCase()}`)}
      {...props}
    />
  );
};

export default StatusBadge;
