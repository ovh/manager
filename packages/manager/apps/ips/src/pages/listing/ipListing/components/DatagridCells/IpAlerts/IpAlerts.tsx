import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useIpHasAlerts } from '@/data/hooks/ip';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { ListingContext } from '@/pages/listing/listingContext';

export type IpAlertsProps = {
  ip: string;
  subIp?: string;
};

/**
 * Component to display the cell content for alerts.
 * If ip has alert display the corresponding badge
 * @param ip the ip with mask
 * @param subIp the sub ip to check
 * @returns React component
 */
export const IpAlerts = ({ ip, subIp }: IpAlertsProps) => {
  const { expiredIps } = useContext(ListingContext);
  const { t } = useTranslation('listing');

  const { hasAlerts, isLoading } = useIpHasAlerts({
    ip,
    subIp,
    enabled: expiredIps.indexOf(ip) === -1,
  });

  if (
    expiredIps.indexOf(ip) !== -1 ||
    (!isLoading &&
      !hasAlerts?.antihack?.length &&
      !hasAlerts?.spam?.length &&
      !hasAlerts?.mitigation?.length)
  )
    return null;

  return (
    <SkeletonCell isLoading={isLoading}>
      {!!hasAlerts?.antihack?.length && (
        <OdsBadge
          label={t('listingColumnsIpAlertsAntihack')}
          color={ODS_BADGE_COLOR.critical}
        ></OdsBadge>
      )}
      {!!hasAlerts?.spam?.length && (
        <OdsBadge
          label={t('listingColumnsIpAlertsSpam')}
          color={ODS_BADGE_COLOR.critical}
        ></OdsBadge>
      )}
      {!!hasAlerts?.mitigation?.length && (
        <OdsBadge
          label={t('listingColumnsIpAlertsMitigation')}
          color={ODS_BADGE_COLOR.critical}
        ></OdsBadge>
      )}
    </SkeletonCell>
  );
};
