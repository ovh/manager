import React, { useContext } from 'react';
import { ipFormatter } from '@/utils/ipFormatter';
import {
  useGetIpdetails,
  useGetIpMitigationWithoutIceberg,
} from '@/data/hooks/ip';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { ListingContext } from '@/pages/listing/listingContext';
import { IpAntiDdosDisplay } from './IpAntiDdosDisplay';
import { isAntiDdosEnabled } from '../enableCellsUtils';

export type IpAntiDdosProps = {
  ip: string;
};

/**
 * Component to display the cell content for Anti DDOS.
 * On this component only data fetching is done. Display is managed by IPAntiDdosDisplay component
 * Display rules:
 * If ip is not /32 (isGroup = true) or not ipv4, we display nothing.
 * If ip mitigation is Permanent we display permanent
 * If ip mitigation is Auto, we display In Action
 * If ip mitigation has no mitigation, we display automatic
 * If mitigation state is not "ok", we display pending
 * @param ip the ip with mask
 * @returns React component
 */
export const IpAntiDdos = ({ ip }: IpAntiDdosProps) => {
  const { expiredIps } = useContext(ListingContext);

  // Check if ip is not a group
  const { isGroup } = ipFormatter(ip);

  // Get ip details
  const { ipDetails, isLoading: isDetailsLoading } = useGetIpdetails({
    ip,
    enabled: !isGroup,
  });

  // get ip mitigation only if ip is ipv4
  const enabled =
    expiredIps.indexOf(ip) === -1 &&
    !isDetailsLoading &&
    isAntiDdosEnabled(ipDetails);

  const { ipMitigation, isLoading, error } = useGetIpMitigationWithoutIceberg({
    ip,
    enabled,
  });

  return (
    <SkeletonCell
      isLoading={isLoading || isDetailsLoading}
      enabled={!isGroup}
      error={error}
    >
      <IpAntiDdosDisplay
        ipMitigation={ipMitigation}
        enabled={enabled}
        ip={ip}
      ></IpAntiDdosDisplay>
    </SkeletonCell>
  );
};
