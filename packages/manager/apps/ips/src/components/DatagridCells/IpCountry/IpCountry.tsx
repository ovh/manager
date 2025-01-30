import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useGetIpdetails } from '@/data/hooks/ip';

export type IpCountryProps = {
  ip: string;
};

/**
 * Component to display the cell content for IP Campus (country)
 * If ip has no campus display "-"
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpCountry = ({ ip }: IpCountryProps) => {
  const { ipDetails, isLoading } = useGetIpdetails({ ip });

  if (isLoading) return <OdsSkeleton></OdsSkeleton>;
  if (!ipDetails?.campus) return <>-</>;
  return <div>{ipDetails.campus}</div>;
};
