import React from 'react';
import { useGetIpdetails } from '@/data/hooks/ip';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';

export type IpTypeProps = {
  ip: string;
};

/**
 * Component to display the cell content for IP Type
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpType = ({ ip }: IpTypeProps) => {
  const { ipDetails, isLoading } = useGetIpdetails({ ip });

  return (
    <SkeletonCell isLoading={isLoading}>
      {ipDetails?.type ? ipDetails.type : <>-</>}
    </SkeletonCell>
  );
};
