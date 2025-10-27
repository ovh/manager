import React from 'react';
import { OdsText, OdsSelect } from '@ovhcloud/ods-components/react';
import {
  IpEdgeFirewallRule,
  IpEdgeFirewallProtocol,
  getIpEdgeFirewallProtocolLabelFromValue,
} from '@/data/api';
import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';

export const ProtocolColumn = (
  rule: IpEdgeFirewallRule & { isNew?: boolean },
) => {
  const { newProtocol, setNewProtocol } = React.useContext(
    EdgeNetworkFirewallContext,
  );

  return rule?.isNew ? (
    <OdsSelect
      name="protocol-select"
      value={newProtocol}
      onOdsChange={(e) =>
        setNewProtocol(e.detail.value as IpEdgeFirewallProtocol)
      }
    >
      {Object.entries(IpEdgeFirewallProtocol).map(([label, value]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </OdsSelect>
  ) : (
    <OdsText>{getIpEdgeFirewallProtocolLabelFromValue(rule?.protocol)}</OdsText>
  );
};
