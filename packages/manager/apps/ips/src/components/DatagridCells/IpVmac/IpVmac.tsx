import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import React from 'react';
import { IpTypeEnum } from '@/data/api';
import { useGetIpVmac, useGetIpdetails } from '@/data/hooks/ip';
import { FailoverRoutedServiceType, getTypeByServiceName } from '@/utils';
import { ipFormatter } from '@/utils/ipFormatter';

export type IpDdosProps = {
  ipGroup: string;
};

/**
 * Component to display the cell content for IP Vmac
 * If ip is not /32 display nothing
 * If ip is not routed to a dedicated server display nothing
 * If ip is /32 and linked to a dedicated server but has no vmac display "-"
 * @param ipGroup the ip with mask
 * @returns React Component
 */
export const IpVmac = ({ ipGroup }: IpDdosProps) => {
  // Check if ip is a group
  const { isGroup } = ipFormatter(ipGroup);

  // check if ip is routed to a dedicated server
  const { ipDetails, isLoading: isIpDetailsLoading } = useGetIpdetails({
    ip: ipGroup,
    enabled: !isGroup,
  });
  const enabled =
    !isIpDetailsLoading &&
    (ipDetails?.type === IpTypeEnum.ADDITIONAL ||
      ipDetails?.type === IpTypeEnum.DEDICATED) &&
    !!ipDetails.routedTo?.serviceName &&
    getTypeByServiceName({ serviceName: ipDetails.routedTo.serviceName }) ===
      FailoverRoutedServiceType.DEDICATED;

  // get vmacs if ip is routed to a dedicated server
  const { vmacs, isLoading } = useGetIpVmac({
    ipGroup,
    serviceName: ipDetails?.routedTo?.serviceName,
    enabled,
  });

  if (isGroup) return null;
  if (isLoading || isIpDetailsLoading) return <OdsSkeleton></OdsSkeleton>;
  if (!enabled) return null;
  if (!vmacs?.length) return <>-</>;

  return (
    <>
      {vmacs.map((vmac) => {
        return <div key={vmac.macAddress}>{vmac.macAddress}</div>;
      })}
    </>
  );
};
