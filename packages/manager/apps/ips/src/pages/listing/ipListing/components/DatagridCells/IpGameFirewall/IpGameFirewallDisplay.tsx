import { useNavigate, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, Skeleton } from '@ovhcloud/ods-react';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { IpGameFirewallStateEnum } from '@/data/api';
import { useGetIpGameFirewall, useIpGameFirewallRuleList } from '@/data/hooks';
import { urlDynamicParts, urls } from '@/routes/routes.constant';
import { fromIpToId, handleEnterAndEscapeKeyDown } from '@/utils';

import { BadgeCell } from '../BadgeCell/BadgeCell';

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
 * @param enabled boolean used to display datas or not
 * @returns React component
 */
export const IpGameFirewallDisplay = ({
  ip,
  ipOnGame,
  enabled,
}: IpGameFirewallDisplayProps) => {
  const { t } = useTranslation('listing');
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const [search] = useSearchParams();

  const { ipGameFirewall } = useGetIpGameFirewall({
    ip,
    ipOnGame,
    enabled,
  });

  const { data: ruleListQuery } = useIpGameFirewallRuleList({
    ip,
    ipOnGame,
    enabled,
  });

  if (!enabled || !ipGameFirewall) {
    return null;
  }

  if (!ruleListQuery) {
    return <Skeleton />;
  }

  const navigateToConfigureGameFirewall = () => {
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
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="cursor-pointer"
      onKeyDown={handleEnterAndEscapeKeyDown({
        onEnter: navigateToConfigureGameFirewall,
      })}
      onClick={navigateToConfigureGameFirewall}
    >
      {ipGameFirewall?.state === IpGameFirewallStateEnum.OK &&
        ruleListQuery?.data?.length === 0 && (
          <BadgeCell
            badgeColor={BADGE_COLOR.neutral}
            text={t('listingColumnsIpGameFirewallAvailable')}
            tooltip={t('listingColumnsIpGameFirewallAvailableTooltip')}
          />
        )}
      {ipGameFirewall?.state === IpGameFirewallStateEnum.OK &&
        ruleListQuery?.data &&
        ruleListQuery.data.length > 0 && (
          <BadgeCell
            badgeColor={BADGE_COLOR.success}
            text={t('listingColumnsIpGameFirewallConfigured')}
            tooltip={t('listingColumnsIpGameFirewallConfiguredTooltip')}
          />
        )}
      {ipGameFirewall?.state !== IpGameFirewallStateEnum.OK && (
        <BadgeCell
          badgeColor={BADGE_COLOR.information}
          text={t('listingColumnsIpGameFirewallPending')}
          tooltip={t('listingColumnsIpGameFirewallPendingTooltip')}
        />
      )}
    </div>
  );
};
