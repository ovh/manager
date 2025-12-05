import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { urlDynamicParts, urls } from '@/routes/routes.constant';
import { fromIpToId } from '@/utils';
import { IpGameFirewallStateEnum } from '@/data/api';
import { BadgeCell } from '../BadgeCell/BadgeCell';
import { useGetIpGameFirewall } from '@/data/hooks';

export type IpGameFirewallDisplayProps = {
  ip: string;
  ipOnGame: string;
  enabled: boolean;
};

/**
 * Component to display the cell content for Game Firewall.
 * If game firewall not enabled display nothing
 * If game firewall state is OK we display available state to user
 * If game firewall state is not ok we display the pending state to user
 * @param ip the block ip if there is one
 * @param ipOnGame the original ip used for gameFirewall request
 * @param ipEdgeFirewall the gameFirewall object for given ip (can be null)
 * @param enabled boolean used to display datas or not
 * @returns React component
 */
export const IpGameFirewallDisplay = ({
  ip,
  ipOnGame,
  enabled,
}: IpGameFirewallDisplayProps) => {
  const id = `gamefirewall-${ip.replace(/\/|\./g, '-')}`;
  const { t } = useTranslation('listing');
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const [search] = useSearchParams();

  const { ipGameFirewall } = useGetIpGameFirewall({
    ip,
    ipOnGame,
    enabled,
  });

  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        trackClick({
          location: PageLocation.datagrid,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['configure_game-firewall'],
        });
        navigate(
          `${urls.configureGameFirewall
            .replace(urlDynamicParts.parentId, fromIpToId(ip))
            .replace(
              urlDynamicParts.id,
              fromIpToId(ipOnGame),
            )}?${search.toString()}`,
        );
      }}
    >
      {enabled && ipGameFirewall?.state === IpGameFirewallStateEnum.OK && (
        <BadgeCell
          badgeColor={ODS_BADGE_COLOR.information}
          text={t('listingColumnsIpGameFirewallAvailable')}
          tooltip={t('listingColumnsIpGameFirewallAvailableTooltip')}
          trigger={id}
        />
      )}
      {enabled &&
        !!ipGameFirewall &&
        ipGameFirewall.state !== IpGameFirewallStateEnum.OK && (
          <BadgeCell
            badgeColor={ODS_BADGE_COLOR.warning}
            text={t('listingColumnsIpGameFirewallPending')}
            tooltip={t('listingColumnsIpGameFirewallPendingTooltip')}
            trigger={id}
          />
        )}
    </div>
  );
};
