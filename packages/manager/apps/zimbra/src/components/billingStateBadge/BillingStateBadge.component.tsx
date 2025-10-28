import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  ODS_BADGE_COLOR,
  ODS_BADGE_ICON_ALIGNMENT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsBadge, OdsSkeleton, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

import { useFormatDate } from '@ovh-ux/manager-react-components';

import { ServiceBillingState, SlotService } from '@/data/api';

export type BillingStateBadgeProps = {
  service?: SlotService;
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
      <OdsSkeleton
        data-testid="billing-state-loading"
        className="[&::part(skeleton)]:max-w-[10rem]"
      />
    );
  }

  return (
    <>
      <OdsBadge
        data-testid={props['data-testid']}
        id={`service-${service.id}`}
        color={color}
        label={label}
        iconAlignment={ODS_BADGE_ICON_ALIGNMENT.right}
        {...(BILLING_STATE_TOOLTIP[service.state] ? { icon: ODS_ICON_NAME.circleInfo } : {})}
      />
      {BILLING_STATE_TOOLTIP[service.state] && (
        <OdsTooltip withArrow position="bottom" triggerId={`service-${service.id}`}>
          <div className="flex flex-col text-center gap-4">
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t(BILLING_STATE_TOOLTIP[service.state])}
            </OdsText>

            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {format({ date: service?.nextBillingDate, format: 'P' })}
            </OdsText>
          </div>
        </OdsTooltip>
      )}
    </>
  );
};

export default BillingStateBadge;
