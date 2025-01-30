import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useGetIpdetails } from '@/data/hooks/ip';

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

  if (isLoading) return <OdsSkeleton></OdsSkeleton>;
  if (!ipDetails?.type) return <>-</>;
  return <div>{ipDetails.type}</div>;
};
