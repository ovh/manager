import React from 'react';

import {
  Select,
  SelectContent,
  SelectControl,
  Text,
} from '@ovhcloud/ods-react';

import { IpGameFirewallRule } from '@/data/api';
import { startCaseFormat } from '@/utils/startCaseFormat';

import { GameFirewallContext } from '../gamefirewall.context';

export const GameProtocolColumn = (
  rule: IpGameFirewallRule & { isNew?: boolean },
) => {
  const {
    supportedProtocols,
    newGameProtocol,
    setNewGameProtocol,
  } = React.useContext(GameFirewallContext);
  return rule?.isNew ? (
    <Select
      name="game-protocol-select"
      value={[newGameProtocol]}
      onValueChange={(e) => setNewGameProtocol(e.value?.[0])}
      items={supportedProtocols.map((protocol) => ({
        label: startCaseFormat(protocol),
        value: protocol,
      }))}
    >
      <SelectControl />
      <SelectContent />
    </Select>
  ) : (
    <Text>{startCaseFormat(rule?.protocol)}</Text>
  );
};
