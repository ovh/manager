import './translations';
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

export const ServiceStateBadge = ({
  state,
  ...rest
}: ServiceStateBadgeProps) => {
  const { t } = useTranslation(NAMESPACES.SERVICE);

  let label = '';
  let color: OdsBadgeColor;

  switch (state) {
    case 'active':
      label = t('service_state_active');
      color = 'success';
      break;
    case 'deleted':
      label = t('service_state_deleted');
      color = 'critical';
      break;
    case 'suspended':
      label = t('service_state_suspended');
      color = 'warning';
      break;
    case 'toActivate':
      label = t('service_state_toActivate');
      color = 'information';
      break;
    case 'toDelete':
      label = t('service_state_toDelete');
      color = 'information';
      break;
    case 'toSuspend':
      label = t('service_state_toSuspend');
      color = 'information';
      break;
    default:
      label = state;
      color = 'information';
      break;
  }

  return <OdsBadge label={label} color={color} {...rest}></OdsBadge>;
};
