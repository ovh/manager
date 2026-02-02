import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, Badge, type BadgeProp } from '@ovhcloud/ods-react';

import { DomainDiagnosisTestStatusEnum } from '@/data/api';

const getStatusBadgeColor = (status: DomainDiagnosisTestStatusEnum): BADGE_COLOR => {
  switch (status) {
    case DomainDiagnosisTestStatusEnum.OK:
      return BADGE_COLOR.success;
    case DomainDiagnosisTestStatusEnum.ERROR:
      return BADGE_COLOR.critical;
    case DomainDiagnosisTestStatusEnum.WARNING:
    case DomainDiagnosisTestStatusEnum.DISABLED:
      return BADGE_COLOR.warning;
    default:
      return BADGE_COLOR.neutral;
  }
};

type StatusBadgeProps = Omit<BadgeProp, 'label' | 'color'> & {
  status: DomainDiagnosisTestStatusEnum;
};

const StatusBadge = ({ status, ...props }: StatusBadgeProps) => {
  const { t } = useTranslation('domains/diagnostic');
  return (
    <Badge color={getStatusBadgeColor(status)} {...props}>
      {t(`zimbra_domain_diagnostic_status_${status.toLowerCase()}`)}
    </Badge>
  );
};

export default StatusBadge;
