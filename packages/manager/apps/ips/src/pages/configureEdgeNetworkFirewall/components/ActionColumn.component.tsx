import React from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { IpEdgeFirewallRule, IpEdgeFirewallRuleState } from '@/data/api';
import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';
import { useCreateIpEdgeNetworkFirewallRule } from '@/data/hooks';

export const ActionColumn = (
  rule: IpEdgeFirewallRule & { isNew?: boolean },
) => {
  const {
    newProtocol,
    newSequence,
    newMode,
    hideNewRuleRow,
    showConfirmDeleteModal,
    createNewRule,
  } = React.useContext(EdgeNetworkFirewallContext);

  return rule?.isNew ? (
    <>
      <OdsButton
        label=""
        icon={ODS_ICON_NAME.xmark}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={hideNewRuleRow}
      />
      <OdsButton
        label=""
        icon={ODS_ICON_NAME.check}
        variant={ODS_BUTTON_VARIANT.ghost}
        isDisabled={
          !newProtocol ||
          !newMode ||
          newSequence === null ||
          newSequence === undefined
        }
        onClick={createNewRule}
      />
    </>
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
