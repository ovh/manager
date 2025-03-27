import React, { useContext } from 'react';
import { ipFormatter } from '@/utils/ipFormatter';
import { useGetIpEdgeFirewall } from '@/data/hooks/ip';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { ListingContext } from '@/pages/listing/listingContext';
import { IpEdgeFirewallDisplay } from './IpEdgeFirewallDisplay';

export type IpEdgeFirewallProps = {
  ip: string;
};

/**
 * Component to display the cell content for Edge Firewall.
 * On this component only data fetching is done. Display is managed by IpEdgeFirewallDisplay component
 * Display rules:
 * If ip is not /32 (isGroup = true) we display nothing.
 * If firewall has not been created yet we dispay the same text as when it is created but disable
 * @param ip the ip with mask
 * @returns React component
 */
export const IpEdgeFirewall = ({ ip }: IpEdgeFirewallProps) => {
  const { expiredIps } = useContext(ListingContext);

  // Check if ip is not group
  const { isGroup } = ipFormatter(ip);

  // Get edge firewall details
  const { ipEdgeFirewall, isLoading, error } = useGetIpEdgeFirewall({
    ip,
    enabled: !isGroup && expiredIps.indexOf(ip) === -1,
  });

  return (
    <SkeletonCell isLoading={isLoading} enabled={!isGroup} error={error}>
      <IpEdgeFirewallDisplay ip={ip} ipEdgeFirewall={ipEdgeFirewall?.[0]} />
    </SkeletonCell>
  );
};
