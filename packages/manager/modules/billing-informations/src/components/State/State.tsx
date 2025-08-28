import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsBadgeColor } from '@ovhcloud/ods-components';
import { OdsBadge, OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { ServiceDetails } from '@ovh-ux/manager-module-common-api';
import { DateFormat, ManagerTile, useFormattedDate } from '@ovh-ux/manager-react-components';

import BillingDetails from '../../BillingDetails.class';
import { useBillingInformationsContextServiceDetails } from '../../BillingInformationsTile.context';
import '../../translations';

export type ServiceRenewStateBadgeProps = Omit<
  React.ComponentProps<typeof OdsBadge>,
  'color' | 'label'
>;

const ServiceRenewStateBadge = ({ ...rest }: ServiceRenewStateBadgeProps) => {
  const { t } = useTranslation('billing-informations-tile');
  const { data: serviceDetails, isLoading } = useBillingInformationsContextServiceDetails();

  const billingDetails = useMemo(
    () => (isLoading ? undefined : new BillingDetails(serviceDetails || ({} as ServiceDetails))),
    [serviceDetails],
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { label, color }: { label: string; color: OdsBadgeColor } = useMemo(() => {
    if (billingDetails?.isResiliated()) {
      return {
        label: t('billing_informations_tile_renew_state_resiliated'),
        color: 'critical',
      };
    }

    if (billingDetails?.hasEngagement() && billingDetails?.shouldDeleteAtExpiration()) {
      return {
        label: t('billing_informations_tile_renew_state_resiliate_planned'),
        color: 'critical',
      };
    }

    if (billingDetails?.isAutomaticRenew()) {
      return {
        label: t('billing_informations_tile_renew_state_automatic'),
        color: 'success',
      };
    }

    if (billingDetails?.isManualRenew()) {
      return {
        label: t('billing_informations_tile_renew_state_manual'),
        color: 'warning',
      };
    }

    if (billingDetails?.isAutomaticRenew()) {
      return {
        label: t('billing_informations_tile_renew_state_automatic'),
        color: 'success',
      };
    }

    return {
      label: billingDetails?.billing.lifecycle.current.state,
      color: 'information',
    };
  }, [billingDetails]);

  if (isLoading) {
    return <OdsSkeleton className="part-skeleton:max-w-xs" />;
  }

  return <OdsBadge label={label} color={color} {...rest}></OdsBadge>;
};

export type ServiceEngagementStateProps = React.ComponentProps<typeof OdsText>;

const ServiceEngagementState = ({ ...rest }: ServiceEngagementStateProps) => {
  const { t } = useTranslation('billing-informations-tile');
  const { data: serviceDetails, isLoading } = useBillingInformationsContextServiceDetails();

  const billingDetails = useMemo(
    () => (isLoading ? undefined : new BillingDetails(serviceDetails || ({} as ServiceDetails))),
    [serviceDetails],
  );

  const endDate = useFormattedDate({
    dateString: billingDetails?.billing?.engagement?.endDate ?? '',
    format: DateFormat.display,
  });

  const engagementLabel = useMemo(() => {
    if (!billingDetails?.hasEngagement() && !billingDetails?.hasPendingResiliation()) {
      return t('billing_informations_tile_engagement_status_none');
    }

    if (billingDetails?.hasEngagementDetails() && billingDetails?.isEngagementExpired()) {
      return t('billing_informations_tile_engagement_status_engaged_expired', {
        date: endDate,
      });
    }

    if (billingDetails?.hasEngagement() && billingDetails?.isAutoCommitmentStrategy()) {
      return t('billing_informations_tile_engagement_status_engaged_renew', {
        date: endDate,
      });
    }

    if (billingDetails?.hasEngagement()) {
      return t('billing_informations_tile_engagement_status_engaged', {
        date: endDate,
      });
    }

    return false;
  }, [billingDetails]);

  if (isLoading) {
    return <OdsSkeleton className="part-skeleton:max-w-xs" />;
  }

  if (engagementLabel) {
    return <OdsText {...rest}>{engagementLabel}</OdsText>;
  }

  return <></>;
};

export const BillingInformationsState = () => {
  const { t } = useTranslation('billing-informations-tile');

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('billing_informations_tile_field_label_state')}
      </ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <div className="flex flex-col gap-2">
          <ServiceEngagementState />
          <ServiceRenewStateBadge />
        </div>
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
