import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useGetIpdetails } from '@/data/hooks/ip';

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

  if (isLoading) return <OdsSkeleton></OdsSkeleton>;
  if (!ipDetails?.routedTo?.serviceName) return <>-</>;
  return <div>{ipDetails.routedTo?.serviceName}</div>;
};
