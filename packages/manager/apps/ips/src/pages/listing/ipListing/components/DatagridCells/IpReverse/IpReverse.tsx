import React, { useContext } from 'react';
import { useGetIpReverse } from '@/data/hooks/ip';
import { ipFormatter } from '@/utils/ipFormatter';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { ListingContext } from '@/pages/listing/listingContext';

export type IpReverseProps = {
  ip: string;
  parentIpGroup?: string;
};

/**
 * Component to display the cell content for IP Reverse
 * If ip is not /32 display nothing
 * If ip has no reverse display "-"
 * If ip has reverse, display the reverse
 * @param ip the ip with mask
 * @param parentIpGroup the parent ip group with mask for ip group child reverse
 * @returns React Component
 */
export const IpReverse = ({ ip, parentIpGroup }: IpReverseProps) => {
  const { expiredIps } = useContext(ListingContext);

  // Check if ip is not /32
  const { ip: formattedIp, isGroup } = ipFormatter(ip);

  // Get ip reverse
  const { ipsReverse, isLoading, error } = useGetIpReverse({
    ip: parentIpGroup || ip,
    enabled: !isGroup && expiredIps.indexOf(ip) === -1,
  });

  return (
    <SkeletonCell isLoading={isLoading} enabled={!isGroup} error={error}>
      {ipsReverse?.find((ipReverse) => ipReverse.ipReverse === formattedIp)
        ?.reverse || <>-</>}
    </SkeletonCell>
  );
};
