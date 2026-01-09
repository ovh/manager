import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';

import { useIpHasAlerts } from '@/data/hooks/ip';
import { ListingContext } from '@/pages/listing/listingContext';

import { SkeletonCell } from '../SkeletonCell/SkeletonCell';

export type IpAlertsProps = {
  ip: string;
  subIp?: string;
  isByoipSlice?: boolean;
};

/**
 * Component to display the cell content for alerts.
 * If ip has alert display the corresponding badge
 * @param ip the ip with mask
 * @param subIp the sub ip to check
 * @returns React component
 */
export const IpAlerts = ({ ip, subIp, isByoipSlice }: IpAlertsProps) => {
  const { expiredIps } = useContext(ListingContext);
  const { t } = useTranslation('listing');

  const { hasAlerts, isLoading } = useIpHasAlerts({
    ip,
    subIp,
    enabled: expiredIps.indexOf(ip) === -1 && !isByoipSlice,
  });

  if (
    expiredIps.indexOf(ip) !== -1 ||
    (!isLoading &&
      !hasAlerts?.antihack?.length &&
      !hasAlerts?.spam?.length &&
      !hasAlerts?.mitigation?.length)
  )
    return <></>;

  return (
    <SkeletonCell isLoading={isLoading}>
      <div className="flex flex-col gap-1">
        {!!hasAlerts?.antihack?.length && (
          <OdsBadge
            label={t('listingColumnsIpAlertsAntihack')}
            color={ODS_BADGE_COLOR.critical}
          />
        )}
        {!!hasAlerts?.spam?.length && (
          <OdsBadge
            label={t('listingColumnsIpAlertsSpam')}
            color={ODS_BADGE_COLOR.critical}
          />
        )}
        {!!hasAlerts?.mitigation?.length && (
          <OdsBadge
            label={t('listingColumnsIpAlertsMitigation')}
            color={ODS_BADGE_COLOR.critical}
          />
        )}
      </div>
    </SkeletonCell>
  );
};
