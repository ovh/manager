import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useGetIpReverse } from '@/data/hooks/ip';
import { ipFormatter } from '@/utils/ipFormatter';

export type IpReverseProps = {
  ipGroup: string;
};

/**
 * Component to display the cell content for IP Reverse
 * If ip is not /32 display nothing
 * If ip has no reverse display "-"
 * If ip has reverse, display the reverse
 * @param ipGroup the ip with mask
 * @returns React Component
 */
export const IpReverse = ({ ipGroup }: IpReverseProps) => {
  // Todo is child of group then get reverse DNS with params ipGroup and filter ipReverse for current ip

  // Check if ip is not /32 (ipgroup)
  const { isGroup } = ipFormatter(ipGroup);

  // Get ip reverse
  const { ipReverse, isLoading } = useGetIpReverse({
    ipGroup,
    enabled: !isGroup,
  });

  if (isGroup) return null;
  if (isLoading) return <OdsSkeleton></OdsSkeleton>;
  if (!ipReverse?.[0]?.reverse) return <>-</>;
  return <div>{ipReverse[0].reverse}</div>;
};
