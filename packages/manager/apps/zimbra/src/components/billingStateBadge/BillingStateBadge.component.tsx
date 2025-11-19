import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  BADGE_COLOR,
  Badge,
  ICON_NAME,
  Icon,
  Skeleton,
  TEXT_PRESET,
  TOOLTIP_POSITION,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { useFormatDate } from '@ovh-ux/muk';

import { ServiceBillingState, SlotService } from '@/data/api';

export type BillingStateBadgeProps = {
  service?: SlotService;
  isLoading?: boolean;
  'data-testid'?: string;
};

const getColor = (status: keyof typeof ServiceBillingState) => {
  switch (status) {
    case ServiceBillingState.AUTOMATIC_RENEWAL:
      return BADGE_COLOR.success;
    case ServiceBillingState.CANCELED:
    case ServiceBillingState.CANCELATION_PLANNED:
      return BADGE_COLOR.critical;
    case ServiceBillingState.MANUAL_RENEWAL:
      return BADGE_COLOR.warning;
    default:
      return BADGE_COLOR.neutral;
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

const BILLING_STATE_TOOLTIP: Record<string, string> = {
  [ServiceBillingState.AUTOMATIC_RENEWAL]: 'service_billing_state_automatic_renewal_tooltip',
  [ServiceBillingState.CANCELATION_PLANNED]: 'service_billing_state_cancelation_planned_tooltip',
};

export const BillingStateBadge: React.FC<BillingStateBadgeProps> = (props) => {
  const { t } = useTranslation('common');
  const { service, isLoading } = props;
  const format = useFormatDate();

  const { color, label } = React.useMemo(() => {
    return {
      color: getColor(service?.state),
      label: t(getKey(service?.state)),
    };
  }, [service, t]);

  if (!service || isLoading) {
    return (
      <Skeleton data-testid="billing-state-loading" className="[&::part(skeleton)]:max-w-40" />
    );
  }

  return (
    <Tooltip position={TOOLTIP_POSITION.bottom}>
      <TooltipTrigger asChild>
        <Badge data-testid={props['data-testid']} color={color}>
          {label}
          {BILLING_STATE_TOOLTIP[service.state] && <Icon name={ICON_NAME.circleInfo} />}
        </Badge>
      </TooltipTrigger>
      {BILLING_STATE_TOOLTIP[service.state] && (
        <TooltipContent withArrow>
          <div className="flex flex-col gap-4 text-center">
            <Text preset={TEXT_PRESET.paragraph}>{t(BILLING_STATE_TOOLTIP[service.state])}</Text>

            <Text preset={TEXT_PRESET.paragraph}>
              {format({ date: service?.nextBillingDate, format: 'P' })}
            </Text>
          </div>
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export default BillingStateBadge;
