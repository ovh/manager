import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useGetIpdetails } from '@/data/hooks/ip';

export type IpRegionProps = {
  ip: string;
};

/**
 * Component to display the cell content for IP Region
 * If ip has no region display "-"
 * If ip has multiple regions display them vertically
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpRegion = ({ ip }: IpRegionProps) => {
  const { ipDetails, isLoading } = useGetIpdetails({ ip });

  if (isLoading) return <OdsSkeleton></OdsSkeleton>;
  if (!ipDetails?.regions) return <>-</>;
  return (
    <div>
      {ipDetails.regions?.map((region) => (
        <div key={region}>{region}</div>
      ))}
    </div>
  );
};
