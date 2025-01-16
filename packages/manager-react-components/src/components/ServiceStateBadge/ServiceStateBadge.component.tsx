import React from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ResourceStatus } from '../../hooks/services/services.type';

export type ServiceStateBadgeProps = Omit<
  React.ComponentProps<typeof OdsBadge>,
  'color' | 'label'
> & {
  state: ResourceStatus;
};

export const STATES = {
  active: { label: 'service_state_active', color: 'success' },
  deleted: { label: 'service_state_deleted', color: 'critical' },
  suspended: { label: 'service_state_suspended', color: 'warning' },
  toActivate: { label: 'service_state_toActivate', color: 'information' },
  toDelete: { label: 'service_state_toDelete', color: 'information' },
  toSuspend: { label: 'service_state_toSuspend', color: 'information' },
} as const;

export const ServiceStateBadge = ({
  state,
  ...rest
}: ServiceStateBadgeProps) => {
  const { t } = useTranslation(NAMESPACES.SERVICE);

  const { label, color } = STATES[state] ?? {
    label: state,
    color: 'information',
  };

  return <OdsBadge label={t(label)} color={color} {...rest}></OdsBadge>;
};
