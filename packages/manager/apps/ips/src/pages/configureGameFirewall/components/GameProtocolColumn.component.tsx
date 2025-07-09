import React from 'react';
import { OdsText, OdsSelect } from '@ovhcloud/ods-components/react';
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
    <OdsSelect
      name="game-protocol-select"
      value={newGameProtocol}
      onOdsChange={(e) => setNewGameProtocol(e.detail.value)}
    >
      {supportedProtocols.map((protocol) => (
        <option key={protocol} value={protocol}>
          {startCaseFormat(protocol)}
        </option>
      ))}
    </OdsSelect>
  ) : (
    <OdsText>{startCaseFormat(rule?.protocol)}</OdsText>
  );
};
