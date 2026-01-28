import React from 'react';

import { FormField, FormFieldError, Input, Text } from '@ovhcloud/ods-react';

import { IpEdgeFirewallProtocol, IpEdgeFirewallRule } from '@/data/api';
import { IP_EDGE_FIREWALL_PORT_MAX } from '@/data/hooks';
import { handleEnterAndEscapeKeyDown } from '@/utils';

import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';

function formatRulePort(port?: string) {
  return port ? port.replace(/[^0-9]*/g, '') : '';
}

export const SourcePortColumn = (
  rule: IpEdgeFirewallRule & { isNew?: boolean },
) => {
  const {
    newProtocol,
    newSourcePort,
    setNewSourcePort,
    newFragments,
    createNewRule,
    hideNewRuleRow,
    sourcePortError,
    setSourcePortError,
  } = React.useContext(EdgeNetworkFirewallContext);

  if (
    !rule?.isNew ||
    !newProtocol ||
    ![IpEdgeFirewallProtocol.UDP, IpEdgeFirewallProtocol.TCP].includes(
      newProtocol,
    )
  ) {
    return <Text>{formatRulePort(rule?.sourcePort)}</Text>;
  }

  return (
    <FormField invalid={!!sourcePortError}>
      <Input
        className="w-full"
        name="source-port-input"
        value={newSourcePort}
        disabled={newFragments}
        invalid={!!sourcePortError}
        onChange={(e) => {
          setNewSourcePort(e.target.value);
          setSourcePortError(undefined);
        }}
        maxLength={IP_EDGE_FIREWALL_PORT_MAX.toString().length}
        onKeyDown={handleEnterAndEscapeKeyDown({
          onEnter: createNewRule,
          onEscape: hideNewRuleRow,
        })}
      />
      <FormFieldError>{sourcePortError}</FormFieldError>
    </FormField>
  );
};

export const DestinationPortColumn = (
  rule: IpEdgeFirewallRule & { isNew?: boolean },
) => {
  const {
    newProtocol,
    newDestinationPort,
    setNewDestinationPort,
    newFragments,
    createNewRule,
    hideNewRuleRow,
    destinationPortError,
    setDestinationPortError,
  } = React.useContext(EdgeNetworkFirewallContext);

  if (
    !rule?.isNew ||
    !newProtocol ||
    ![IpEdgeFirewallProtocol.UDP, IpEdgeFirewallProtocol.TCP].includes(
      newProtocol,
    )
  ) {
    return <Text>{formatRulePort(rule?.destinationPort)}</Text>;
  }

  return (
    <FormField invalid={!!destinationPortError}>
      <Input
        className="w-full"
        name="destination-port-input"
        value={newDestinationPort}
        disabled={newFragments}
        invalid={!!destinationPortError}
        onChange={(e) => {
          setNewDestinationPort(e.target.value);
          setDestinationPortError(undefined);
        }}
        maxLength={IP_EDGE_FIREWALL_PORT_MAX.toString().length}
        onKeyDown={handleEnterAndEscapeKeyDown({
          onEnter: createNewRule,
          onEscape: hideNewRuleRow,
        })}
      />
      <FormFieldError>{destinationPortError}</FormFieldError>
    </FormField>
  );
};
