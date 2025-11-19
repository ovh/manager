import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { urlDynamicParts, urls } from '@/routes/routes.constant';
import { IpEdgeFirewallStateEnum, IpEdgeFirewallType } from '@/data/api';
import { BadgeCell } from '../BadgeCell/BadgeCell';
import { fromIpToId } from '@/utils';

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
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { trackClick } = useOvhTracking();

  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        trackClick({
          location: PageLocation.datagrid,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['configure_edge-network-firewall'],
        });
        navigate(
          `${urls.configureEdgeNetworkFirewall.replace(
            urlDynamicParts.id,
            fromIpToId(ip),
          )}?${search.toString()}`,
        );
      }}
    >
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
    </div>
  );
};
