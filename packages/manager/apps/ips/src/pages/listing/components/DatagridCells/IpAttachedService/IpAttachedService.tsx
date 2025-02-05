import React from 'react';
import { useGetIpdetails } from '@/data/hooks/ip';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';

export type IpAttachedServiceProps = {
  ip: string;
};

/**
 * Component to display the cell content for IP Attached service
 * If ip has no attached services display "-"
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpAttachedService = ({ ip }: IpAttachedServiceProps) => {
  const { ipDetails, isLoading } = useGetIpdetails({ ip });

  return (
    <SkeletonCell isLoading={isLoading}>
      {!ipDetails?.routedTo?.serviceName && <>-</>}
      {ipDetails?.routedTo?.serviceName}
    </SkeletonCell>
  );
};
