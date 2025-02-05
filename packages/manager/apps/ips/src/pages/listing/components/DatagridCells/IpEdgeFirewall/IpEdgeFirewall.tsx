import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ipFormatter } from '@/utils/ipFormatter';
import { useGetIpEdgeFirewall } from '@/data/hooks/ip';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { ListingContext } from '@/pages/listing/listingContext';

export type IpEdgeFirewallProps = {
  ip: string;
};

/**
 * Component to display the cell content for Edge Firewall.
 * If ip is not /32 (isGroup = true) we display nothing.
 * If firewall has not been created yet we dispay the same text as when it is created but disable
 * @param ip the ip with mask
 * @returns React component
 */
export const IpEdgeFirewall = ({ ip }: IpEdgeFirewallProps) => {
  const { expiredIps } = useContext(ListingContext);
  const { t } = useTranslation('listing');

  // Check if ip is not group
  const { isGroup } = ipFormatter(ip);

  // Get edge firewall details
  const { ipEdgeFirewall, isLoading, error } = useGetIpEdgeFirewall({
    ip,
    enabled: !isGroup && expiredIps.indexOf(ip) === -1,
  });

  return (
    <SkeletonCell isLoading={isLoading} enabled={!isGroup} error={error}>
      {!ipEdgeFirewall?.length && (
        <div>{t('listingColumnsIpEdgeFirewallDisabled')}</div>
      )}
      {!!ipEdgeFirewall?.[0] && (
        <div key={ipEdgeFirewall[0].ipOnFirewall}>
          {ipEdgeFirewall[0].enabled
            ? t('listingColumnsIpEdgeFirewallEnabled')
            : t('listingColumnsIpEdgeFirewallDisabled')}
        </div>
      )}
    </SkeletonCell>
  );
};
