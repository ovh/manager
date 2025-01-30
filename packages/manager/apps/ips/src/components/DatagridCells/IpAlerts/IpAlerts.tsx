import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge, OdsSkeleton } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useIpHasAlerts } from '@/data/hooks/ip/useIpHasAlerts';

export type IpAlertsProps = {
  ipGroup: string;
};

/**
 * Component to display the cell content for alerts.
 * If ip has alert display the corresponding badge
 * @param ipGroup the ip with mask
 * @returns React component
 */
export const IpAlerts = ({ ipGroup }: IpAlertsProps) => {
  const { t } = useTranslation('listing');

  const { hasAlerts, isLoading } = useIpHasAlerts({ ipGroup });

  if (isLoading) return <OdsSkeleton></OdsSkeleton>;
  if (
    !hasAlerts?.antihack?.length &&
    !hasAlerts?.spam?.length &&
    !hasAlerts?.mitigation?.length
  )
    return null;
  return (
    <>
      {hasAlerts?.antihack?.length && (
        <OdsBadge
          label={t('listingColumnsIpAlertsAntihack')}
          color={ODS_BADGE_COLOR.critical}
        ></OdsBadge>
      )}
      {hasAlerts?.spam?.length && (
        <OdsBadge
          label={t('listingColumnsIpAlertsSpam')}
          color={ODS_BADGE_COLOR.critical}
        ></OdsBadge>
      )}
      {hasAlerts?.mitigation?.length && (
        <OdsBadge
          label={t('listingColumnsIpAlertsMitigation')}
          color={ODS_BADGE_COLOR.critical}
        ></OdsBadge>
      )}
    </>
  );
};
