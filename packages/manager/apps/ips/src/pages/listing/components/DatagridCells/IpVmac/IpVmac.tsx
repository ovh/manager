import React, { useContext } from 'react';
import { IpTypeEnum } from '@/data/api';
import { useGetIpVmac, useGetIpdetails } from '@/data/hooks/ip';
import { IPRoutedServiceType, getTypeByServiceName } from '@/utils';
import { ipFormatter } from '@/utils/ipFormatter';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { ListingContext } from '@/pages/listing/listingContext';

export type IpDdosProps = {
  ip: string;
};

/**
 * Component to display the cell content for IP Vmac
 * If ip is not /32 display nothing
 * If ip is not routed to a dedicated server display nothing
 * If ip is /32 and linked to a dedicated server but has no vmac display "-"
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpVmac = ({ ip }: IpDdosProps) => {
  const { expiredIps } = useContext(ListingContext);
  // Check if ip is a group
  const { isGroup } = ipFormatter(ip);

  // check if ip is routed to a dedicated server
  const { ipDetails, isLoading: isIpDetailsLoading } = useGetIpdetails({
    ip,
    enabled: !isGroup,
  });

  const enabled =
    expiredIps.indexOf(ip) === -1 &&
    !isIpDetailsLoading &&
    (ipDetails?.type === IpTypeEnum.ADDITIONAL ||
      ipDetails?.type === IpTypeEnum.DEDICATED) &&
    getTypeByServiceName({ serviceName: ipDetails?.routedTo?.serviceName }) ===
      IPRoutedServiceType.DEDICATED;

  // get vmacs if ip is routed to a dedicated server
  const { vmacs, isLoading, error } = useGetIpVmac({
    serviceName: ipDetails?.routedTo?.serviceName,
    enabled,
  });

  return (
    <SkeletonCell
      isLoading={isLoading || isIpDetailsLoading}
      enabled={!isGroup}
      error={error}
    >
      {!enabled && null}
      {enabled && !vmacs?.length && <>-</>}
      {enabled &&
        vmacs?.map((vmac) => {
          return <div key={vmac.macAddress}>{vmac.macAddress}</div>;
        })}
    </SkeletonCell>
  );
};
