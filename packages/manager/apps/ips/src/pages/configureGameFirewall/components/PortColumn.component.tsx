import React from 'react';

import { Input, Text } from '@ovhcloud/ods-react';

import { IpGameFirewallRule } from '@/data/api';
import { handleEnterAndEscapeKeyDown } from '@/utils';

import { GameFirewallContext } from '../gamefirewall.context';
import { PORT_MAX } from '../gamefirewall.utils';

export const StartPortColumn = (
  rule: IpGameFirewallRule & { isNew?: boolean },
) => {
  const {
    newStartPort,
    setNewStartPort,
    addRule,
    hideNewRuleRow,
  } = React.useContext(GameFirewallContext);

  return rule?.isNew ? (
    <Input
      className="w-full"
      name="start-port-input"
      value={newStartPort}
      onChange={(e) => setNewStartPort(e.target.value)}
      maxLength={PORT_MAX.toString().length}
      onKeyDown={handleEnterAndEscapeKeyDown({
        onEnter: addRule,
        onEscape: hideNewRuleRow,
      })}
    />
  ) : (
    <Text>{rule?.ports?.from}</Text>
  );
};

export const EndPortColumn = (
  rule: IpGameFirewallRule & { isNew?: boolean },
) => {
  const {
    newEndPort,
    setNewEndPort,
    addRule,
    hideNewRuleRow,
  } = React.useContext(GameFirewallContext);

  return rule?.isNew ? (
    <Input
      className="w-full"
      name="end-port-input"
      value={newEndPort}
      onChange={(e) => setNewEndPort(e.target.value)}
      maxLength={PORT_MAX.toString().length}
      onKeyDown={handleEnterAndEscapeKeyDown({
        onEnter: addRule,
        onEscape: hideNewRuleRow,
      })}
    />
  ) : (
    <Text>{rule?.ports?.to}</Text>
  );
};
