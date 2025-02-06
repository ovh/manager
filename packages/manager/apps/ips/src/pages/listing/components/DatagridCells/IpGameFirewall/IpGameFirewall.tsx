import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { IpGameFirewallStateEnum, IpTypeEnum } from '@/data/api';
import { useGetIpGameFirewall, useGetIpdetails } from '@/data/hooks/ip';
import { IPRoutedServiceType, getTypeByServiceName } from '@/utils';
import { ipFormatter } from '@/utils/ipFormatter';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { ListingContext } from '@/pages/listing/listingContext';
import { datagridCellStyle } from '../datagridCellStyles';
import { IconCell } from '../IconCell/IconCell';

export type IpGameFirewallProps = {
  ip: string;
};

/**
 * Component to display the cell content for Game Firewall.
 * If ip is not /32 (isGroup = true) we display nothing.
 * If ip is different than type "dedicated or additionnal", we display nothing
 * If ip is not routed to a dedicated server, we display nothing
 * If ip is routed to a dedicated server is /32 and additionnal or dedicated type we display Game firewall infos
 * @param ip the ip with mask
 * @returns React component
 */
export const IpGameFirewall = ({ ip }: IpGameFirewallProps) => {
  const id = `gamefirewall-${ip.replace(/\/|\./g, '-')}`;
  const { expiredIps } = useContext(ListingContext);
  const { t } = useTranslation('listing');

  // Check if ip is not group
  const { isGroup } = ipFormatter(ip);

  // Check if ip is not cloud
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
      {enabled && ipGameFirewall?.[0]?.state === IpGameFirewallStateEnum.OK && (
        <IconCell
          icon={ODS_ICON_NAME.gameControllerAlt}
          text={t('listingColumnsIpGameFirewallAvailable')}
        />
      )}
      {enabled &&
        !!ipGameFirewall?.length &&
        ipGameFirewall?.[0]?.state !== IpGameFirewallStateEnum.OK && (
          <IconCell
            icon={ODS_ICON_NAME.gameControllerAlt}
            text={t('listingColumnsIpGameFirewallPending')}
            tooltip={t('listingColumnsIpGameFirewallPendingTooltip')}
            trigger={id}
            style={datagridCellStyle.iconWarning}
          />
        )}
    </SkeletonCell>
  );
};
