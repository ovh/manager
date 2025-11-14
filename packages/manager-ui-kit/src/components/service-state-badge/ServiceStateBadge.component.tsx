import React from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { Badge } from '@/components/badge/Badge.component';
import { ServiceStateBadgeProps } from '@/components/service-state-badge/ServiceStateBadge.props';

const STATES = {
  active: { label: 'service_state_active', color: 'success' },
  deleted: { label: 'service_state_deleted', color: 'critical' },
  suspended: { label: 'service_state_suspended', color: 'warning' },
  toActivate: { label: 'service_state_toActivate', color: 'information' },
  toDelete: { label: 'service_state_toDelete', color: 'information' },
  toSuspend: { label: 'service_state_toSuspend', color: 'information' },
} as const;

export const ServiceStateBadge = ({ state, ...rest }: ServiceStateBadgeProps) => {
  const { t } = useTranslation(NAMESPACES.SERVICE);

  const { label, color } = STATES[state] ?? {
    label: state,
    color: 'information',
  };

  return (
    <Badge color={color} {...rest}>
      {t(label)}
    </Badge>
  );
};
