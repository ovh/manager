import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetIpGameFirewall, useGetIpdetails } from '@/data/hooks/ip';
import { ipFormatter } from '@/utils/ipFormatter';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { ListingContext } from '@/pages/listing/listingContext';
import { IpGameFirewallDisplay } from './IpGameFirewallDisplay';
import { isGameFirewallEnabled } from '../enableCellsUtils';

export type IpGameFirewallProps = {
  ip: string;
};

/**
 * Component to display the cell content for Game Firewall.
 * On this component only data fetching is done. Display is managed by IpGameFirewallDisplay component
 * Display rules:
 * If ip is not /32 (isGroup = true) we display nothing.
 * If ip is different than type "dedicated or additionnal", we display nothing
 * If ip is not routed to a dedicated server, we display nothing
 * If ip is routed to a dedicated server is /32 and additionnal or dedicated type we display Game firewall infos
 * @param ip the ip with mask
 * @returns React component
 */
export const IpGameFirewall = ({ ip }: IpGameFirewallProps) => {
  const { expiredIps } = useContext(ListingContext);

  // Check if ip is not group
  const { isGroup } = ipFormatter(ip);

  // Check if ip is not cloud
  const { ipDetails, isLoading: isIpDetailsLoading } = useGetIpdetails({
    ip,
    enabled: !isGroup,
  });

  // not expired and additionnal / dedicated Ip linked to a dedicated server
  const enabled =
    expiredIps.indexOf(ip) === -1 &&
    !isIpDetailsLoading &&
    isGameFirewallEnabled(ipDetails);

  // Get game firewall info
  const { ipGameFirewall, isLoading, error } = useGetIpGameFirewall({
    ip,
    enabled,
  });

  return (
    <SkeletonCell
      isLoading={isIpDetailsLoading || isLoading}
      enabled={!isGroup}
      error={error}
      ip={ip}
    >
      <IpGameFirewallDisplay
        ip={ip}
        ipGameFirewall={ipGameFirewall?.[0]}
        enabled={enabled}
      />
    </SkeletonCell>
  );
};
