import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { IpEdgeFirewallRule, IpEdgeFirewallRuleState } from '@/data/api';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';

const translationKeyByStatus: Record<IpEdgeFirewallRuleState, string> = {
  ok: 'ok',
  removalPending: 'deleting',
  creationPending: 'creating',
};

export const StatusColumn = (
  rule?: IpEdgeFirewallRule & { isNew?: boolean },
) => {
  const { firewallModeEnabled } = React.useContext(EdgeNetworkFirewallContext);
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.edgeNetworkFirewall,
    NAMESPACES.STATUS,
  ]);

  if (!rule || rule?.isNew) {
    return null;
  }

  const color =
    rule?.state === IpEdgeFirewallRuleState.OK
      ? ODS_BADGE_COLOR.success
      : ODS_BADGE_COLOR.information;

  return (
    <OdsBadge
      size={ODS_BADGE_SIZE.lg}
      color={firewallModeEnabled ? color : ODS_BADGE_COLOR.neutral}
      label={
        firewallModeEnabled
          ? t(translationKeyByStatus[rule?.state], { ns: NAMESPACES.STATUS })
          : t('disabled_status')
      }
    />
  );
};
