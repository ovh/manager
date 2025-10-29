import React from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { IpGameFirewallRule, IpGameFirewallStateEnum } from '@/data/api';
import { GameFirewallContext } from '../gamefirewall.context';

export const ActionColumn = (
  rule: IpGameFirewallRule & { isNew?: boolean },
) => {
  const {
    newGameProtocol,
    hideNewRuleRow,
    showConfirmDeleteModal,
    addRule,
  } = React.useContext(GameFirewallContext);

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
        isDisabled={!newGameProtocol}
        onClick={addRule}
      />
    </>
  ) : (
    <OdsButton
      label=""
      icon={ODS_ICON_NAME.trash}
      variant={ODS_BUTTON_VARIANT.ghost}
      isDisabled={rule?.state !== IpGameFirewallStateEnum.OK}
      onClick={() => showConfirmDeleteModal(rule)}
    />
  );
};
