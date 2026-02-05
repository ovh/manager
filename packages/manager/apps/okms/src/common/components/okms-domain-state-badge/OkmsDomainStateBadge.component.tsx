import { OkmsServiceState } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { Badge, BadgeColor, BadgeProp } from '@ovhcloud/ods-react';

const colors: Record<OkmsServiceState, BadgeColor> = {
  OK: 'success',
  EXPIRED: 'critical',
  SUSPENDED: 'warning',
  IN_CREATION: 'information',
};

export type OkmsDomainStateBadgeProps = {
  state: OkmsServiceState;
} & Omit<BadgeProp, 'color' | 'children'>;

export const OkmsDomainStateBadge = ({
  state,
  size = 'md',
  ...rest
}: OkmsDomainStateBadgeProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  const labels: Record<OkmsServiceState, string> = {
    OK: t('key_management_service_dashboard_dashboard_field_state_active'),
    EXPIRED: t('key_management_service_dashboard_dashboard_field_state_deleted'),
    SUSPENDED: t('key_management_service_dashboard_dashboard_field_state_suspended'),
    IN_CREATION: t('key_management_service_dashboard_dashboard_field_state_toActivate'),
  };

  return (
    <Badge size={size} color={colors[state] || 'neutral'} {...rest}>
      {labels[state] || state}
    </Badge>
  );
};
