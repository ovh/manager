import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge, OdsSkeleton } from '@ovhcloud/ods-components/react';

import { ServiceBillingState } from '@/data/api';

export type BillingStateBadgeProps = {
  state?: keyof typeof ServiceBillingState;
  isLoading?: boolean;
  'data-testid'?: string;
};

const getColor = (status: keyof typeof ServiceBillingState) => {
  switch (status) {
    case ServiceBillingState.AUTOMATIC_RENEWAL:
      return ODS_BADGE_COLOR.success;
    case ServiceBillingState.CANCELED:
    case ServiceBillingState.CANCELATION_PLANNED:
      return ODS_BADGE_COLOR.critical;
    case ServiceBillingState.MANUAL_RENEWAL:
      return ODS_BADGE_COLOR.warning;
    default:
      return ODS_BADGE_COLOR.neutral;
  }
};

const getKey = (state: keyof typeof ServiceBillingState) => {
  switch (state) {
    case ServiceBillingState.CANCELED:
      return 'service_billing_state_canceled';
    case ServiceBillingState.CANCELATION_PLANNED:
      return 'service_billing_state_cancelation_planned';
    case ServiceBillingState.AUTOMATIC_RENEWAL:
      return 'service_billing_state_automatic_renewal';
    case ServiceBillingState.MANUAL_RENEWAL:
      return 'service_billing_state_manual_renewal';
    default:
      return 'service_billing_state_unhandled';
  }
};

export const BillingStateBadge: React.FC<BillingStateBadgeProps> = (props) => {
  const { t } = useTranslation('common');
  const { state, isLoading } = props;

  const { color, label } = React.useMemo(() => {
    return {
      color: getColor(state),
      label: t(getKey(state)),
    };
  }, [state]);

  if (!state || isLoading) {
    return (
      <OdsSkeleton
        data-testid="billing-state-loading"
        className="[&::part(skeleton)]:max-w-[10rem]"
      />
    );
  }

  return <OdsBadge data-testid={props['data-testid']} color={color} label={label} />;
};

export default BillingStateBadge;
