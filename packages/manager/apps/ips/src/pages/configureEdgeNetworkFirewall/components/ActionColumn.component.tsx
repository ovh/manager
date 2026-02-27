import React from 'react';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Icon,
  ICON_NAME,
  Button,
} from '@ovhcloud/ods-react';

import { IpEdgeFirewallRule, IpEdgeFirewallRuleState } from '@/data/api';

import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';

export const ActionColumn = (
  rule: IpEdgeFirewallRule & { isNew?: boolean },
) => {
  const {
    newSequence,
    hideNewRuleRow,
    showConfirmDeleteModal,
    createNewRule,
  } = React.useContext(EdgeNetworkFirewallContext);

  return rule?.isNew ? (
    <div className="flex gap-3">
      <Button
        size={BUTTON_SIZE.xs}
        variant={BUTTON_VARIANT.ghost}
        onClick={hideNewRuleRow}
      >
        <Icon name={ICON_NAME.xmark} />
      </Button>
      <Button
        size={BUTTON_SIZE.xs}
        variant={BUTTON_VARIANT.ghost}
        disabled={newSequence === null || newSequence === undefined}
        onClick={createNewRule}
      >
        <Icon name={ICON_NAME.check} />
      </Button>
    </div>
  ) : (
    <Button
      size={BUTTON_SIZE.sm}
      variant={BUTTON_VARIANT.ghost}
      disabled={rule?.state !== IpEdgeFirewallRuleState.OK}
      onClick={() => showConfirmDeleteModal(rule)}
    >
      <Icon name={ICON_NAME.trash} />
    </Button>
  );
};
