import React, { useContext } from 'react';
import { useGetIpReverse } from '@/data/hooks/ip';
import { ipFormatter } from '@/utils/ipFormatter';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { ListingContext } from '@/pages/listing/listingContext';

export type IpReverseProps = {
  ip: string;
};

/**
 * Component to display the cell content for IP Reverse
 * If ip is not /32 display nothing
 * If ip has no reverse display "-"
 * If ip has reverse, display the reverse
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpReverse = ({ ip }: IpReverseProps) => {
  const { expiredIps } = useContext(ListingContext);
  // Todo is child of group then get reverse DNS with params ip and filter ipReverse for current ip

  // Check if ip is not /32
  const { isGroup } = ipFormatter(ip);

  // Get ip reverse
  const { ipReverse, isLoading, error } = useGetIpReverse({
    ip,
    enabled: !isGroup && expiredIps.indexOf(ip) === -1,
  });

  return (
    <SkeletonCell isLoading={isLoading} enabled={!isGroup} error={error}>
      {ipReverse?.[0]?.reverse ? ipReverse[0].reverse : <>-</>}
    </SkeletonCell>
  );
};
