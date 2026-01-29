import React, { useContext } from 'react';

import { useGetIpEdgeFirewall } from '@/data/hooks/ip';
import { ListingContext } from '@/pages/listing/listingContext';
import { ipFormatter } from '@/utils/ipFormatter';

import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { IpEdgeFirewallDisplay } from './IpEdgeFirewallDisplay';

export type IpEdgeFirewallProps = {
  ip: string;
  ipOnFirewall?: string;
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
export const IpEdgeFirewall = ({ ip, ipOnFirewall }: IpEdgeFirewallProps) => {
  const { expiredIps } = useContext(ListingContext);
  const { isGroup, ipAddress } = ipFormatter(ip);

  const enabled = React.useMemo(
    () =>
      ((isGroup && !!ipOnFirewall) || !isGroup) &&
      expiredIps.indexOf(ip) === -1,
    [isGroup, ipOnFirewall, ip, expiredIps],
  );

  // Get edge firewall details
  const { ipEdgeFirewall, isLoading, error } = useGetIpEdgeFirewall({
    ip,
    ipOnFirewall: ipOnFirewall ?? ipAddress,
    enabled,
  });

  return (
    <SkeletonCell
      isLoading={isLoading}
      enabled={enabled}
      error={error}
      ip={ipOnFirewall ?? ip}
    >
      <IpEdgeFirewallDisplay
        parentIp={ip}
        ip={ipOnFirewall ?? ip}
        ipEdgeFirewall={ipEdgeFirewall}
      />
    </SkeletonCell>
  );
};
