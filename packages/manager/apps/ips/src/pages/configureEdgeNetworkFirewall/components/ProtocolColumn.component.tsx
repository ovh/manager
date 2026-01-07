import React from 'react';

import {
  OdsFormField,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';

import {
  IpEdgeFirewallProtocol,
  IpEdgeFirewallRule,
  getIpEdgeFirewallProtocolLabelFromValue,
} from '@/data/api';

import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';

export const ProtocolColumn = (
  rule: IpEdgeFirewallRule & { isNew?: boolean },
) => {
  const { newProtocol, setNewProtocol, protocolError, setProtocolError } =
    React.useContext(EdgeNetworkFirewallContext);

  return rule?.isNew ? (
    <OdsFormField className="flex w-full" error={protocolError}>
      <OdsSelect
        className="block"
        name="protocol-select"
        value={newProtocol}
        hasError={!!protocolError}
        onOdsChange={(e) => {
          setNewProtocol(e.detail.value as IpEdgeFirewallProtocol);
          setProtocolError(undefined);
        }}
      >
        {Object.entries(IpEdgeFirewallProtocol).map(([label, value]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </OdsSelect>
    </OdsFormField>
  ) : (
    <OdsText>{getIpEdgeFirewallProtocolLabelFromValue(rule?.protocol)}</OdsText>
  );
};
