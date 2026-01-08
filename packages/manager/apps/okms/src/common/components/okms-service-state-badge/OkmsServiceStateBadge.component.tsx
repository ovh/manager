import { useTranslation } from 'react-i18next';

import { Badge, BadgeColor, BadgeProp } from '@ovhcloud/ods-react';

import { ResourceStatus } from '@ovh-ux/manager-react-components';

const colors: Record<ResourceStatus, BadgeColor> = {
  active: 'success',
  deleted: 'critical',
  suspended: 'warning',
  toActivate: 'information',
  toDelete: 'neutral',
  toSuspend: 'neutral',
};

export type OkmsStateProps = {
  state: ResourceStatus;
} & Omit<BadgeProp, 'color' | 'children'>;

export const OkmsServiceState = ({ state, size = 'md', ...rest }: OkmsStateProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  const labels: Record<ResourceStatus, string> = {
    active: t('key_management_service_dashboard_dashboard_field_state_active'),
    deleted: t('key_management_service_dashboard_dashboard_field_state_deleted'),
    suspended: t('key_management_service_dashboard_dashboard_field_state_suspended'),
    toActivate: t('key_management_service_dashboard_dashboard_field_state_toActivate'),
    toDelete: t('key_management_service_dashboard_dashboard_field_state_toDelete'),
    toSuspend: t('key_management_service_dashboard_dashboard_field_state_toSuspend'),
  };

  return (
    <Badge size={size} color={colors[state] || 'neutral'} {...rest}>
      {labels[state] || state}
    </Badge>
  );
};
