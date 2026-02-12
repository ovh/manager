import { useContext } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { useGetIpGameFirewall, useGetIpdetails } from '@/data/hooks/ip';
import { ListingContext } from '@/pages/listing/listingContext';
import { ipFormatter } from '@/utils/ipFormatter';

import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { IpRowData, isGameFirewallAvailable } from '../enableCellsUtils';
import { IpGameFirewallDisplay } from './IpGameFirewallDisplay';

/**
 * Component to display the cell content for Game Firewall.
 * On this component only data fetching is done. Display is managed by IpGameFirewallDisplay component
 * Display rules:
 * If ip is not /32 (isGroup = true) we display nothing.
 * If ip is different than type "dedicated or additionnal", we display nothing
 * If ip is not routed to a dedicated server, we display nothing
 * If ip is routed to a dedicated server is /32 and additionnal or dedicated type we display Game firewall infos
 * @param ip the ip with mask
 * @param ipOnGame the ip without mask
 * @returns React component
 */
// export const IpGameFirewall = ({ ip, ipOnGame }: IpGameFirewallProps) => {
export const IpGameFirewall: ColumnDef<IpRowData>['cell'] = ({ row }) => {
  const { ip, parentIpGroup } = row.original;
  const ipToFetch = parentIpGroup || ip;
  const ipOnGame = parentIpGroup ? ip : undefined;

  const { expiredIps } = useContext(ListingContext);

  // Check if ip is not group
  const { isGroup, ipAddress } = ipFormatter(ipToFetch);

  // Check if ip is not cloud
  const { ipDetails, loading: isIpDetailsLoading } = useGetIpdetails({
    ip: isGroup && ipOnGame ? ipOnGame : ip,
  });

  // not expired and additionnal / dedicated Ip linked to a dedicated server
  const enabled =
    expiredIps.indexOf(ip) === -1 &&
    !isIpDetailsLoading &&
    isGameFirewallAvailable(ipDetails);

  // Get game firewall info
  const { isLoading: loading, error } = useGetIpGameFirewall({
    ip: ipToFetch,
    ipOnGame: ipOnGame || ipAddress,
    enabled,
  });

  return (
    <SkeletonCell
      loading={isIpDetailsLoading || loading}
      enabled={(!isGroup || !!ipOnGame) && enabled}
      error={error}
      ip={ipToFetch}
    >
      <IpGameFirewallDisplay
        ip={ipToFetch}
        ipOnGame={ipOnGame || ipAddress}
        enabled={enabled}
      />
    </SkeletonCell>
  );
};
