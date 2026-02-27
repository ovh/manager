import { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, Badge } from '@ovhcloud/ods-react';
import { ColumnDef } from '@tanstack/react-table';

import { useIpHasAlerts } from '@/data/hooks/ip';
import { ListingContext } from '@/pages/listing/listingContext';

import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { IpRowData } from '../enableCellsUtils';

/**
 * Component to display the cell content for alerts.
 * If ip has alert display the corresponding badge
 * @param ip the ip with mask
 * @param subIp the sub ip to check
 * @returns React component
 */
export const IpAlerts: ColumnDef<IpRowData>['cell'] = ({ row }) => {
  const { ip, parentIpGroup, isByoipSlice } = row.original;
  const { expiredIps } = useContext(ListingContext);
  const { t } = useTranslation(TRANSLATION_NAMESPACES.listing);

  const { hasAlerts, loading } = useIpHasAlerts({
    ip: parentIpGroup || ip,
    subIp: ip,
    enabled: expiredIps.indexOf(parentIpGroup || ip) === -1 && !isByoipSlice,
  });

  if (
    expiredIps.indexOf(parentIpGroup || ip) !== -1 ||
    (!loading &&
      !hasAlerts?.antihack?.length &&
      !hasAlerts?.spam?.length &&
      !hasAlerts?.mitigation?.length)
  ) {
    return <></>;
  }

  return (
    <SkeletonCell loading={loading}>
      <div className="flex flex-col justify-items-start gap-2">
        {!!hasAlerts?.antihack?.length && (
          <Badge color={BADGE_COLOR.critical}>
            {t('listingColumnsIpAlertsAntihack')}
          </Badge>
        )}
        {!!hasAlerts?.spam?.length && (
          <Badge color={BADGE_COLOR.critical}>
            {t('listingColumnsIpAlertsSpam')}
          </Badge>
        )}
        {!!hasAlerts?.mitigation?.length && (
          <Badge color={BADGE_COLOR.critical}>
            {t('listingColumnsIpAlertsMitigation')}
          </Badge>
        )}
      </div>
    </SkeletonCell>
  );
};
