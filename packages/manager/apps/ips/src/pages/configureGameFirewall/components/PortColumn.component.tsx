import React from 'react';
import { OdsText, OdsInput } from '@ovhcloud/ods-components/react';
import { IpGameFirewallRule } from '@/data/api';
import { PORT_MAX } from '../gamefirewall.utils';
import { GameFirewallContext } from '../gamefirewall.context';

export const StartPortColumn = (
  rule: IpGameFirewallRule & { isNew?: boolean },
) => {
  const { newStartPort, setNewStartPort } = React.useContext(
    GameFirewallContext,
  );

  return rule?.isNew ? (
    <OdsInput
      className="w-full"
      name="start-port-input"
      value={newStartPort}
      onOdsChange={(e) => setNewStartPort(e.detail.value as string)}
      maxlength={PORT_MAX.toString().length}
    />
  ) : (
    <OdsText>{rule?.ports?.from}</OdsText>
  );
};

export const EndPortColumn = (
  rule: IpGameFirewallRule & { isNew?: boolean },
) => {
  const { newEndPort, setNewEndPort } = React.useContext(GameFirewallContext);

  return rule?.isNew ? (
    <OdsInput
      className="w-full"
      name="end-port-input"
      value={newEndPort}
      onOdsChange={(e) => setNewEndPort(e.detail.value as string)}
      maxlength={PORT_MAX.toString().length}
    />
  ) : (
    <OdsText>{rule?.ports?.to}</OdsText>
  );
};
