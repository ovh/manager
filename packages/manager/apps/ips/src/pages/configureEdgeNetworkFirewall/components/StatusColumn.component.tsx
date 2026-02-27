import React from 'react';

import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, BADGE_SIZE, Badge } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { IpEdgeFirewallRule, IpEdgeFirewallRuleState } from '@/data/api';
import { TRANSLATION_NAMESPACES } from '@/utils';

import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';

const translationKeyByStatus: Record<IpEdgeFirewallRuleState, string> = {
  [IpEdgeFirewallRuleState.OK]: 'ok',
  [IpEdgeFirewallRuleState.REMOVAL_PENDING]: 'deleting',
  [IpEdgeFirewallRuleState.CREATION_PENDING]: 'creating',
};

export const StatusColumn = (
  rule: IpEdgeFirewallRule & { isNew?: boolean },
) => {
  const { firewallModeEnabled } = React.useContext(EdgeNetworkFirewallContext);
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.edgeNetworkFirewall,
    NAMESPACES.STATUS,
  ]);

  if (!rule || rule?.isNew) {
    return <></>;
  }

  const color =
    rule?.state === IpEdgeFirewallRuleState.OK
      ? BADGE_COLOR.success
      : BADGE_COLOR.information;

  return (
    <Badge
      size={BADGE_SIZE.lg}
      color={
        !firewallModeEnabled && rule?.state === IpEdgeFirewallRuleState.OK
          ? BADGE_COLOR.neutral
          : color
      }
    >
      {rule?.state === IpEdgeFirewallRuleState.OK && !firewallModeEnabled
        ? t('disabled_status')
        : t(translationKeyByStatus[rule?.state], { ns: NAMESPACES.STATUS })}
    </Badge>
  );
};
