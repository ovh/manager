import React from 'react';

import {
  FormFieldError,
  FormField,
  Select,
  Text,
  SelectContent,
  SelectControl,
} from '@ovhcloud/ods-react';

import {
  IpEdgeFirewallProtocol,
  IpEdgeFirewallRule,
  getIpEdgeFirewallProtocolLabelFromValue,
} from '@/data/api';

import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';

export const ProtocolColumn = (
  rule: IpEdgeFirewallRule & { isNew?: boolean },
) => {
  const {
    newProtocol,
    setNewProtocol,
    protocolError,
    setProtocolError,
  } = React.useContext(EdgeNetworkFirewallContext);

  return rule?.isNew ? (
    <FormField className="w-full" invalid={!!protocolError}>
      <Select
        className="block"
        name="protocol-select"
        value={[newProtocol]}
        invalid={!!protocolError}
        onValueChange={(e) => {
          setNewProtocol(e.value?.[0] as IpEdgeFirewallProtocol);
          setProtocolError(undefined);
        }}
        items={Object.entries(IpEdgeFirewallProtocol).map(([label, value]) => ({
          label,
          value,
        }))}
      >
        <SelectContent />
        <SelectControl />
      </Select>
      <FormFieldError>{protocolError}</FormFieldError>
    </FormField>
  ) : (
    <Text>{getIpEdgeFirewallProtocolLabelFromValue(rule?.protocol)}</Text>
  );
};
