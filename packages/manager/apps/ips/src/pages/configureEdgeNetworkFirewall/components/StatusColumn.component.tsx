import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';

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
      ? ODS_BADGE_COLOR.success
      : ODS_BADGE_COLOR.information;

  return (
    <OdsBadge
      size={ODS_BADGE_SIZE.lg}
      color={
        !firewallModeEnabled && rule?.state === IpEdgeFirewallRuleState.OK
          ? ODS_BADGE_COLOR.neutral
          : color
      }
      label={
        rule?.state === IpEdgeFirewallRuleState.OK && !firewallModeEnabled
          ? t('disabled_status')
          : t(translationKeyByStatus[rule?.state], { ns: NAMESPACES.STATUS })
      }
    />
  );
};
