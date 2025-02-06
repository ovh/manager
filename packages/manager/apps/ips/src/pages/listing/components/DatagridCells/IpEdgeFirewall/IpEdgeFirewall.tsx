import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ipFormatter } from '@/utils/ipFormatter';
import { useGetIpEdgeFirewall } from '@/data/hooks/ip';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { ListingContext } from '@/pages/listing/listingContext';
import { datagridCellStyle } from '../datagridCellStyles';
import { IpEdgeFirewallStateEnum } from '@/data/api';
import { IconCell } from '../IconCell/IconCell';

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
  const id = `edgefirewall-${ip.replace(/\/|\./g, '-')}`;
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
        <IconCell
          icon={ODS_ICON_NAME.shieldFirewall}
          text={t('listingColumnsIpEdgeFirewallDisabled')}
          tooltip={t('listingColumnsIpEdgeFirewallDisabledTooltip')}
          trigger={id}
          style={datagridCellStyle.iconDisable}
        />
      )}
      {!!ipEdgeFirewall?.[0] && (
        <div key={ipEdgeFirewall[0].ipOnFirewall}>
          {ipEdgeFirewall[0].state === IpEdgeFirewallStateEnum.OK &&
            ipEdgeFirewall[0].enabled && (
              <IconCell
                icon={ODS_ICON_NAME.shieldFirewall}
                text={t('listingColumnsIpEdgeFirewallEnabled')}
                tooltip={t('listingColumnsIpEdgeFirewallEnabledTooltip')}
                trigger={id}
              />
            )}
          {ipEdgeFirewall[0].state === IpEdgeFirewallStateEnum.OK &&
            !ipEdgeFirewall[0].enabled && (
              <IconCell
                icon={ODS_ICON_NAME.shieldFirewall}
                text={t('listingColumnsIpEdgeFirewallDisabled')}
                tooltip={t('listingColumnsIpEdgeFirewallDisabledTooltip')}
                trigger={id}
                style={datagridCellStyle.iconDisable}
              />
            )}
          {ipEdgeFirewall[0].state !== IpEdgeFirewallStateEnum.OK && (
            <IconCell
              icon={ODS_ICON_NAME.shieldFirewall}
              text={t('listingColumnsIpEdgeFirewallPending')}
              tooltip={t('listingColumnsIpEdgeFirewallPendingTooltip')}
              trigger={id}
              style={datagridCellStyle.iconWarning}
            />
          )}
        </div>
      )}
    </SkeletonCell>
  );
};
