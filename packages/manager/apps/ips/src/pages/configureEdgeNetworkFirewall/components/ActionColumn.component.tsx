import React from 'react';

import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

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
    <div className="flex gap-4">
      <OdsButton
        size={ODS_BUTTON_SIZE.xs}
        label=""
        icon={ODS_ICON_NAME.xmark}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={hideNewRuleRow}
      />
      <OdsButton
        size={ODS_BUTTON_SIZE.xs}
        label=""
        icon={ODS_ICON_NAME.check}
        variant={ODS_BUTTON_VARIANT.ghost}
        isDisabled={newSequence === null || newSequence === undefined}
        onClick={createNewRule}
      />
    </div>
  ) : (
    <OdsButton
      label=""
      icon={ODS_ICON_NAME.trash}
      variant={ODS_BUTTON_VARIANT.ghost}
      isDisabled={rule?.state !== IpEdgeFirewallRuleState.OK}
      onClick={() => showConfirmDeleteModal(rule)}
    />
  );
};
