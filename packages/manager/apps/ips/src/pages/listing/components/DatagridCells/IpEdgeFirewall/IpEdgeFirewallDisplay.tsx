import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { datagridCellStyle } from '../datagridCellStyles';
import { IpEdgeFirewallStateEnum, IpEdgeFirewallType } from '@/data/api';
import { IconCell } from '../IconCell/IconCell';

export type IpEdgeFirewallDetailsProps = {
  ipEdgeFirewall: IpEdgeFirewallType;
  ip: string;
};

/**
 * Component to display the cell content for Edge Firewall.
 * If edge firewall not enabled display nothing
 * If firewall has not been created yet we dispay the same text as when it is created but disable
 * @param ip the original ip used for edgeFirewall request
 * @param ipEdgeFirewall the edgeFirewall object for given ip (can be null)
 * @returns React component
 */
export const IpEdgeFirewallDisplay = ({
  ip,
  ipEdgeFirewall,
}: IpEdgeFirewallDetailsProps) => {
  const id = `edgefirewall-${ip.replace(/\/|\./g, '-')}`;
  const { t } = useTranslation('listing');

  return (
    <>
      {!ipEdgeFirewall && (
        <IconCell
          icon={ODS_ICON_NAME.shieldFirewall}
          text={t('listingColumnsIpEdgeFirewallDisabled')}
          tooltip={t('listingColumnsIpEdgeFirewallDisabledTooltip')}
          trigger={id}
          style={datagridCellStyle.iconDisable}
        />
      )}
      {!!ipEdgeFirewall && (
        <div key={ipEdgeFirewall.ipOnFirewall}>
          {ipEdgeFirewall.state === IpEdgeFirewallStateEnum.OK &&
            ipEdgeFirewall.enabled && (
              <IconCell
                icon={ODS_ICON_NAME.shieldFirewall}
                text={t('listingColumnsIpEdgeFirewallEnabled')}
                tooltip={t('listingColumnsIpEdgeFirewallEnabledTooltip')}
                trigger={id}
              />
            )}
          {ipEdgeFirewall.state === IpEdgeFirewallStateEnum.OK &&
            !ipEdgeFirewall.enabled && (
              <IconCell
                icon={ODS_ICON_NAME.shieldFirewall}
                text={t('listingColumnsIpEdgeFirewallDisabled')}
                tooltip={t('listingColumnsIpEdgeFirewallDisabledTooltip')}
                trigger={id}
                style={datagridCellStyle.iconDisable}
              />
            )}
          {ipEdgeFirewall.state !== IpEdgeFirewallStateEnum.OK && (
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
    </>
  );
};
