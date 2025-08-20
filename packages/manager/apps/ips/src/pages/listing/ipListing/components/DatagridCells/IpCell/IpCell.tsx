import React from 'react';
import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import { ipFormatter } from '@/utils/ipFormatter';
import { useGetIpdetails } from '@/data/hooks/ip';

export type IpCellProps = {
  ip: string;
  parentIpGroup?: string;
};

/**
 * Component to display the cell content for IP Address
 * if ip has /32 mask, do not display it ex: 10.0.0.1/32 -> 10.0.0.1
 * if ip has mask other than /32 display it ex: 10.0.0.1/24 -> 10.0.0.1/24
 * If ip has description, we display it under
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpCell = ({ ip, parentIpGroup }: IpCellProps) => {
  const { ipDetails, isLoading } = useGetIpdetails({ ip: parentIpGroup || ip });

  return (
    <>
      <div>{ipFormatter(ip).ip}</div>
      {isLoading && (
        <div className="mt-2">
          <OdsSkeleton></OdsSkeleton>
        </div>
      )}
      {!isLoading && !!ipDetails?.description && (
        <small className="mt-2 inline-block">{ipDetails?.description}</small>
      )}
    </>
  );
};
