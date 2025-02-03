import React from 'react';
import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import { ipFormatter } from '@/utils/ipFormatter';
import { useGetIpdetails } from '@/data/hooks/ip';

export type IpCellProps = {
  ipGroup: string;
};

/**
 * Component to display the cell content for IP Address
 * if ip has /32 mask, do not display it ex: 10.0.0.1/32 -> 10.0.0.1
 * if ip has mask other than /32 display it ex: 10.0.0.1/24 -> 10.0.0.1/24
 * @param ipGroup the ip with mask
 * @returns React Component
 */
export const IpCell = ({ ipGroup }: IpCellProps) => {
  const { ipDetails, isLoading, error } = useGetIpdetails({ ip: ipGroup });

  return (
    <>
      <div>{ipFormatter(ipGroup).ip}</div>
      {isLoading ? (
        <OdsSkeleton></OdsSkeleton>
      ) : (
        <small>{ipDetails?.description}</small>
      )}
    </>
  );
};
