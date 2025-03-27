import React, { useContext } from 'react';
import { useGetIpVmac, useGetIpdetails } from '@/data/hooks/ip';
import { ipFormatter } from '@/utils/ipFormatter';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { ListingContext } from '@/pages/listing/listingContext';
import { isVmacEnabled } from '../enableCellsUtils';

export type IpVmacProps = {
  ip: string;
};

/**
 * Component to display the cell content for IP Vmac
 * On this component only data fetching is done. Display is managed by IpVmacDisplay component
 * Display rules:
 * If ip is not /32 display nothing
 * If ip is not routed to a dedicated server display nothing
 * If ip is /32 and linked to a dedicated server but has no vmac display "-"
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpVmac = ({ ip }: IpVmacProps) => {
  const { expiredIps } = useContext(ListingContext);
  // Check if ip is a group
  const { isGroup } = ipFormatter(ip);

  // check if ip is routed to a dedicated server
  const { ipDetails, isLoading: isIpDetailsLoading } = useGetIpdetails({
    ip,
    enabled: !isGroup,
  });

  // not expired and additionnal / dedicated Ip linked to a dedicated server
  const enabled =
    expiredIps.indexOf(ip) === -1 &&
    !isIpDetailsLoading &&
    isVmacEnabled(ipDetails);

  // get vmacs if ip is routed to a dedicated server
  const { vmacs, isLoading, error } = useGetIpVmac({
    serviceName: ipDetails?.routedTo?.serviceName,
    enabled,
  });

  return (
    <SkeletonCell
      isLoading={isLoading || isIpDetailsLoading}
      enabled={!isGroup}
      error={error}
    >
      {!enabled && null}
      {enabled && !vmacs?.length && <>-</>}
      {enabled &&
        vmacs?.map((vmac) => (
          <div key={vmac.macAddress}>{vmac.macAddress}</div>
        ))}
    </SkeletonCell>
  );
};
