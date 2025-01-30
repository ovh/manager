import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IpTypeEnum } from '@/data/api';
import { useGetIpGameFirewall, useGetIpdetails } from '@/data/hooks/ip';
import { FailoverRoutedServiceType, getTypeByServiceName } from '@/utils';
import { ipFormatter } from '@/utils/ipFormatter';

export type IpGameFirewallProps = {
  ipGroup: string;
};

/**
 * Component to display the cell content for Game Firewall.
 * If ip is not /32 (isGroup = true) we display nothing.
 * If ip is diferrent than type "dedicated or additionnal", we display nothing
 * If ip is not routed to a dedicated server, we display nothing
 * If ip is routed to a dedicated server is /32 and additionnal or dedicated type we display Game firewall infos
 * @param ipGroup the ip with mask
 * @returns React component
 */
export const IpGameFirewall = ({ ipGroup }: IpGameFirewallProps) => {
  const { t } = useTranslation('listing');

  // Check if ip is not group
  const { isGroup } = ipFormatter(ipGroup);

  // Check if ip is not cloud
  const { ipDetails, isLoading: isIpDetailsLoading } = useGetIpdetails({
    ip: ipGroup,
    enabled: !isGroup,
  });
  const enabled =
    !isIpDetailsLoading &&
    (ipDetails?.type === IpTypeEnum.ADDITIONAL ||
      ipDetails?.type === IpTypeEnum.DEDICATED) &&
    !!ipDetails?.routedTo?.serviceName &&
    getTypeByServiceName({ serviceName: ipDetails.routedTo.serviceName }) ===
      FailoverRoutedServiceType.DEDICATED;

  // Get game firewall info
  const { ipGameFirewall, isLoading } = useGetIpGameFirewall({
    ipGroup,
    enabled,
  });

  if (isGroup) return null;
  if (!enabled || !ipGameFirewall?.length) return null;
  if (isLoading) return <OdsSkeleton></OdsSkeleton>;
  return (
    <>
      {ipGameFirewall.length ? (
        <div> {t('listingColumnsIpGameFirewallAvailable')}</div>
      ) : null}
    </>
  );
};
