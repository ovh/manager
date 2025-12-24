import React from 'react';

import { OdsInput, OdsText } from '@ovhcloud/ods-components/react';

import { IpGameFirewallRule } from '@/data/api';
import { handleEnterAndEscapeKeyDown } from '@/utils';

import { GameFirewallContext } from '../gamefirewall.context';
import { PORT_MAX } from '../gamefirewall.utils';

export const StartPortColumn = (
  rule: IpGameFirewallRule & { isNew?: boolean },
) => {
  const { newStartPort, setNewStartPort, addRule, hideNewRuleRow } =
    React.useContext(GameFirewallContext);

  return rule?.isNew ? (
    <OdsInput
      className="w-full"
      name="start-port-input"
      value={newStartPort}
      onOdsChange={(e) => setNewStartPort(e.detail.value as string)}
      maxlength={PORT_MAX.toString().length}
      onKeyDown={handleEnterAndEscapeKeyDown({
        onEnter: addRule,
        onEscape: hideNewRuleRow,
      })}
    />
  ) : (
    <OdsText>{rule?.ports?.from}</OdsText>
  );
};

export const EndPortColumn = (
  rule: IpGameFirewallRule & { isNew?: boolean },
) => {
  const { newEndPort, setNewEndPort, addRule, hideNewRuleRow } =
    React.useContext(GameFirewallContext);

  return rule?.isNew ? (
    <OdsInput
      className="w-full"
      name="end-port-input"
      value={newEndPort}
      onOdsChange={(e) => setNewEndPort(e.detail.value as string)}
      maxlength={PORT_MAX.toString().length}
      onKeyDown={handleEnterAndEscapeKeyDown({
        onEnter: addRule,
        onEscape: hideNewRuleRow,
      })}
    />
  ) : (
    <OdsText>{rule?.ports?.to}</OdsText>
  );
};
