import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { IpEdgeFirewallStateEnum, IpEdgeFirewallType } from '@/data/api';
import { BadgeCell } from '../BadgeCell/BadgeCell';

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
        <BadgeCell
          badgeColor={ODS_BADGE_COLOR.neutral}
          text={t('listingColumnsIpEdgeFirewallDisabled')}
          tooltip={t('listingColumnsIpEdgeFirewallDisabledTooltip')}
          trigger={id}
        />
      )}
      {!!ipEdgeFirewall && (
        <div key={ipEdgeFirewall.ipOnFirewall}>
          {ipEdgeFirewall.state === IpEdgeFirewallStateEnum.OK &&
            ipEdgeFirewall.enabled && (
              <BadgeCell
                badgeColor={ODS_BADGE_COLOR.information}
                text={t('listingColumnsIpEdgeFirewallEnabled')}
                tooltip={t('listingColumnsIpEdgeFirewallEnabledTooltip')}
                trigger={id}
              />
            )}
          {ipEdgeFirewall.state === IpEdgeFirewallStateEnum.OK &&
            !ipEdgeFirewall.enabled && (
              <BadgeCell
                badgeColor={ODS_BADGE_COLOR.neutral}
                text={t('listingColumnsIpEdgeFirewallDisabled')}
                tooltip={t('listingColumnsIpEdgeFirewallDisabledTooltip')}
                trigger={id}
              />
            )}
          {ipEdgeFirewall.state !== IpEdgeFirewallStateEnum.OK && (
            <BadgeCell
              badgeColor={ODS_BADGE_COLOR.warning}
              text={t('listingColumnsIpEdgeFirewallPending')}
              tooltip={t('listingColumnsIpEdgeFirewallPendingTooltip')}
              trigger={id}
            />
          )}
        </div>
      )}
    </>
  );
};
