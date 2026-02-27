import React from 'react';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Icon,
  ICON_NAME,
  Button,
} from '@ovhcloud/ods-react';

import { IpGameFirewallRule } from '@/data/api';

import { GameFirewallContext } from '../gamefirewall.context';

export const ActionColumn = (
  rule: IpGameFirewallRule & { isNew?: boolean },
) => {
  const { hideNewRuleRow, showConfirmDeleteModal, addRule } = React.useContext(
    GameFirewallContext,
  );

  return rule?.isNew ? (
    <div className="flex gap-4">
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
        onClick={addRule}
      >
        <Icon name={ICON_NAME.check} />
      </Button>
    </div>
  ) : (
    <Button
      variant={BUTTON_VARIANT.ghost}
      disabled={rule?.state !== 'ok'}
      onClick={() => showConfirmDeleteModal(rule)}
    >
      <Icon name={ICON_NAME.trash} />
    </Button>
  );
};
