import React from 'react';

import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { IpGameFirewallRule } from '@/data/api';

import { GameFirewallContext } from '../gamefirewall.context';

export const ActionColumn = (
  rule: IpGameFirewallRule & { isNew?: boolean },
) => {
  const { hideNewRuleRow, showConfirmDeleteModal, addRule } =
    React.useContext(GameFirewallContext);

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
        onClick={addRule}
      />
    </div>
  ) : (
    <OdsButton
      label=""
      icon={ODS_ICON_NAME.trash}
      variant={ODS_BUTTON_VARIANT.ghost}
      isDisabled={rule?.state !== 'ok'}
      onClick={() => showConfirmDeleteModal(rule)}
    />
  );
};
