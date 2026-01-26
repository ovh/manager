import React, { useContext } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { useGetIpEdgeFirewall } from '@/data/hooks/ip';
import { ListingContext } from '@/pages/listing/listingContext';
import { ipFormatter } from '@/utils/ipFormatter';

import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { IpEdgeFirewallDisplay } from './IpEdgeFirewallDisplay';
import { IpRowData } from '../enableCellsUtils';

/**
 * Component to display the cell content for Edge Firewall.
 * On this component only data fetching is done. Display is managed by IpEdgeFirewallDisplay component
 * Display rules:
 * If ip is not /32 (isGroup = true) we display nothing.
 * If firewall has not been created yet we dispay the same text as when it is created but disable
 * @param ip the ip with mask
 * @returns React component
 */
export const IpEdgeFirewall: ColumnDef<IpRowData>['cell'] = ({ row }) => {
  const { ip, parentIpGroup } = row.original;
  const ipToFetch = parentIpGroup || ip;
  const ipOnFirewall = parentIpGroup ? ip : undefined;

  const { expiredIps } = useContext(ListingContext);
  const { isGroup, ipAddress } = ipFormatter(ipToFetch);

  const enabled = React.useMemo(
    () =>
      ((isGroup && !!ipOnFirewall) || !isGroup) &&
      expiredIps.indexOf(ip) === -1 &&
      !!ip,
    [isGroup, ipOnFirewall, ip, expiredIps],
  );

  // Get edge firewall details
  const { ipEdgeFirewall, loading, error } = useGetIpEdgeFirewall({
    ip: ipToFetch,
    ipOnFirewall: ipOnFirewall ?? ipAddress,
    enabled,
  });

  return (
    <SkeletonCell
      loading={loading}
      enabled={enabled}
      error={error}
      ip={ipOnFirewall ?? ipToFetch}
    >
      <IpEdgeFirewallDisplay
        parentIp={ipToFetch}
        ip={ipOnFirewall ?? ip}
        ipEdgeFirewall={ipEdgeFirewall}
      />
    </SkeletonCell>
  );
};
