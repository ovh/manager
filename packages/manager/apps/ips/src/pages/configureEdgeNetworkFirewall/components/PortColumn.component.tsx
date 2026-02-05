import React from 'react';

import {
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';

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
    return <OdsText>{formatRulePort(rule?.sourcePort)}</OdsText>;
  }

  return (
    <OdsFormField error={sourcePortError}>
      <OdsInput
        className="w-full"
        name="source-port-input"
        value={newSourcePort}
        isDisabled={newFragments}
        hasError={!!sourcePortError}
        onOdsChange={(e) => {
          setNewSourcePort(e.detail.value as string);
          setSourcePortError(undefined);
        }}
        maxlength={IP_EDGE_FIREWALL_PORT_MAX.toString().length}
        onKeyDown={handleEnterAndEscapeKeyDown({
          onEnter: createNewRule,
          onEscape: hideNewRuleRow,
        })}
      />
    </OdsFormField>
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
    return <OdsText>{formatRulePort(rule?.destinationPort)}</OdsText>;
  }

  return (
    <OdsFormField error={destinationPortError}>
      <OdsInput
        className="w-full"
        name="destination-port-input"
        value={newDestinationPort}
        isDisabled={newFragments}
        hasError={!!destinationPortError}
        onOdsChange={(e) => {
          setNewDestinationPort(e.detail.value as string);
          setDestinationPortError(undefined);
        }}
        maxlength={IP_EDGE_FIREWALL_PORT_MAX.toString().length}
        onKeyDown={handleEnterAndEscapeKeyDown({
          onEnter: createNewRule,
          onEscape: hideNewRuleRow,
        })}
      />
    </OdsFormField>
  );
};
