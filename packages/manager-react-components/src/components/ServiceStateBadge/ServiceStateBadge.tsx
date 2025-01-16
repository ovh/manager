import React from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { OdsBadgeColor } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ResourceStatus } from '../../hooks/services/services.type';

export type ServiceStateBadgeProps = Omit<
  React.ComponentProps<typeof OdsBadge>,
  'color' | 'label'
> & {
  state: ResourceStatus;
};

export const STATES = {
  ACTIVE: { label: 'service_state_active', color: 'success' },
  DELETED: { label: 'service_state_deleted', color: 'critical' },
  SUSPENDED: { label: 'service_state_suspended', color: 'warning' },
  TO_ACTIVATE: { label: 'service_state_toActivate', color: 'information' },
  TO_DELETE: { label: 'service_state_toDelete', color: 'information' },
  TO_SUSPEND: { label: 'service_state_toSuspend', color: 'information' },
} as const;

export const mapResourceStatusToState = (resourceStatus: ResourceStatus) => {
  return {
    active: STATES.ACTIVE,
    deleted: STATES.DELETED,
    suspended: STATES.SUSPENDED,
    toActivate: STATES.TO_ACTIVATE,
    toDelete: STATES.TO_DELETE,
    toSuspend: STATES.TO_SUSPEND,
  }[resourceStatus];
};

export const ServiceStateBadge = ({
  state,
  ...rest
}: ServiceStateBadgeProps) => {
  const { t } = useTranslation(NAMESPACES.SERVICE);

  const { label, color } = mapResourceStatusToState(state) ?? {
    label: state,
    color: 'information',
  };

  return <OdsBadge label={t(label)} color={color} {...rest}></OdsBadge>;
};
