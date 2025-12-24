import { useNavigate, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { IpEdgeFirewallStateEnum, IpEdgeFirewallType } from '@/data/api';
import { urlDynamicParts, urls } from '@/routes/routes.constant';
import {
  TRANSLATION_NAMESPACES,
  fromIpToId,
  handleEnterAndEscapeKeyDown,
} from '@/utils';

import { BadgeCell } from '../BadgeCell/BadgeCell';

export type IpEdgeFirewallDetailsProps = {
  ip: string;
  ipEdgeFirewall?: IpEdgeFirewallType;
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
  const { t } = useTranslation(TRANSLATION_NAMESPACES.listing);
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { trackClick } = useOvhTracking();

  const navigateToConfigureEdgeNetworkFirewall = () => {
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
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="cursor-pointer"
      aria-label={t('listingActionConfigureEdgeNetworkFirewall')}
      onClick={navigateToConfigureEdgeNetworkFirewall}
      onKeyDown={handleEnterAndEscapeKeyDown({
        onEnter: navigateToConfigureEdgeNetworkFirewall,
      })}
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
