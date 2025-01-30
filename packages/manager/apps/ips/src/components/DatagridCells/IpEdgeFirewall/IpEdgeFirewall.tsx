import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ipFormatter } from '@/utils/ipFormatter';
import { useGetIpEdgeFirewall } from '@/data/hooks/ip';

export type IpEdgeFirewallProps = {
  ipGroup: string;
};

/**
 * Component to display the cell content for Edge Firewall.
 * If ip is not /32 (isGroup = true) we display nothing.
 * @param ipGroup the ip with mask
 * @returns React component
 */
export const IpEdgeFirewall = ({ ipGroup }: IpEdgeFirewallProps) => {
  const { t } = useTranslation('listing');

  // Check if ip is not group
  const { isGroup } = ipFormatter(ipGroup);

  // Get edge firewall details
  const { ipEdgeFirewall, isLoading } = useGetIpEdgeFirewall({
    ipGroup,
    enabled: !isGroup,
  });

  if (isGroup) return null;
  if (isLoading) return <OdsSkeleton></OdsSkeleton>;
  if (!ipEdgeFirewall?.length)
    return <div>{t('listingColumnsIpEdgeFirewallDisabled')}</div>;
  return (
    <>
      <div key={ipEdgeFirewall[0].ipOnFirewall}>
        {ipEdgeFirewall[0].enabled
          ? t('listingColumnsIpEdgeFirewallEnabled')
          : t('listingColumnsIpEdgeFirewallDisabled')}
      </div>
    </>
  );
};
