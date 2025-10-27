import React from 'react';
import { OdsText, OdsInput } from '@ovhcloud/ods-components/react';
import { IpEdgeFirewallProtocol, IpEdgeFirewallRule } from '@/data/api';
import { handleEnterAndEscapeKeyDown } from '@/utils';
import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';
import { IP_EDGE_FIREWALL_PORT_MAX } from '@/data/hooks';

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
  } = React.useContext(EdgeNetworkFirewallContext);

  if (
    !rule?.isNew ||
    ![IpEdgeFirewallProtocol.UDP, IpEdgeFirewallProtocol.TCP].includes(
      newProtocol,
    )
  ) {
    return <OdsText>{formatRulePort(rule?.destinationPort)}</OdsText>;
  }

  return (
    <OdsInput
      className="w-full"
      name="source-port-input"
      value={newSourcePort}
      isDisabled={newFragments}
      onOdsChange={(e) => setNewSourcePort(e.detail.value as string)}
      maxlength={IP_EDGE_FIREWALL_PORT_MAX.toString().length}
      onKeyDown={handleEnterAndEscapeKeyDown({
        onEnter: createNewRule,
        onEscape: hideNewRuleRow,
      })}
    />
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
  } = React.useContext(EdgeNetworkFirewallContext);

  if (
    !rule?.isNew ||
    ![IpEdgeFirewallProtocol.UDP, IpEdgeFirewallProtocol.TCP].includes(
      newProtocol,
    )
  ) {
    return <OdsText>{formatRulePort(rule?.destinationPort)}</OdsText>;
  }

  return (
    <OdsInput
      className="w-full"
      name="destination-port-input"
      value={newDestinationPort}
      isDisabled={newFragments}
      onOdsChange={(e) => setNewDestinationPort(e.detail.value as string)}
      maxlength={IP_EDGE_FIREWALL_PORT_MAX.toString().length}
      onKeyDown={handleEnterAndEscapeKeyDown({
        onEnter: createNewRule,
        onEscape: hideNewRuleRow,
      })}
    />
  );
};
