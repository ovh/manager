import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge, OdsSkeleton } from '@ovhcloud/ods-components/react';

import { useGetIpdetails } from '@/data/hooks/ip';
import { ListingContext } from '@/pages/listing/listingContext';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { ipFormatter } from '@/utils/ipFormatter';

export type IpCellProps = {
  ip: string;
  parentIpGroup?: string;
};

/**
 * Component to display the cell content for IP Address
 * if ip has /32 mask, do not display it ex: 10.0.0.1/32 -> 10.0.0.1
 * if ip has mask other than /32 display it ex: 10.0.0.1/24 -> 10.0.0.1/24
 * If ip has description, we display it under
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpCell = ({ ip, parentIpGroup }: IpCellProps) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.listing);
  const { onGoingAggregatedIps, onGoingSlicedIps, onGoingCreatedIps } =
    useContext(ListingContext);
  const { ipDetails, isLoading } = useGetIpdetails({ ip: parentIpGroup || ip });

  return (
    <>
      <div>{ipFormatter(ip).ip}</div>
      {isLoading && (
        <div className="mt-2">
          <OdsSkeleton />
        </div>
      )}
      {!isLoading && !!ipDetails?.description && (
        <small className="mt-2 inline-block">{ipDetails?.description}</small>
      )}
      <div className="mt-2">
        {onGoingAggregatedIps.includes(ip) && (
          <OdsBadge
            label={t('aggregate_in_progress')}
            color={ODS_BADGE_COLOR.information}
          />
        )}
        {onGoingSlicedIps.includes(ip) && (
          <OdsBadge
            label={t('slice_in_progress')}
            color={ODS_BADGE_COLOR.information}
          />
        )}
        {onGoingCreatedIps.includes(ip) && (
          <OdsBadge
            label={t('creation_in_progress')}
            color={ODS_BADGE_COLOR.information}
          />
        )}
      </div>
    </>
  );
};
