import React from 'react';

import {
  OdsText,
  OdsTooltip,
  OdsIcon,
  OdsFormField,
  OdsInput,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { IpEdgeFirewallProtocol, IpEdgeFirewallRule } from '@/data/api';
import { IP_EDGE_FIREWALL_PORT_MAX } from '@/data/hooks';
import { handleEnterAndEscapeKeyDown, TRANSLATION_NAMESPACES } from '@/utils';

import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';

function formatRulePort(port?: string) {
  if (!port) {
    return '';
  }

  if (port.includes('range')) {
    const rangeMatch = port.match(/range (\d+) (\d+)/);

    if (rangeMatch) {
      const startPort = rangeMatch[1];
      const endPort = rangeMatch[2];
      return `${startPort}-${endPort}`;
    }
  }

  return port.replace(/[^0-9]*/g, '');
}

const PortRangeTooltip = ({ id }: { id: string }) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.edgeNetworkFirewall);
  const tooltipId = `${id}-port-format-tooltip`;
  return (
    <>
      <OdsIcon
        id={tooltipId}
        name={ODS_ICON_NAME.circleQuestion}
        tabIndex={0}
        className="ml-2 cursor-pointer text-[var(--ods-color-text)]"
      />
      <OdsTooltip triggerId={tooltipId} withArrow>
        <OdsText className="p-2">{t('port_format_tooltip')}</OdsText>
      </OdsTooltip>
    </>
  );
};

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
    <OdsFormField
      className="flex flex-row items-center"
      error={sourcePortError}
    >
      <OdsInput
        className="w-full"
        name="source-port-input"
        value={newSourcePort}
        isDisabled={newFragments}
        hasError={!!sourcePortError}
        onOdsChange={(e) => {
          const newValue = ((e.detail.value as string) || '').replace(
            /[^0-9-]*/g,
            '',
          );
          setNewSourcePort(newValue);
          setSourcePortError(undefined);
        }}
        maxlength={IP_EDGE_FIREWALL_PORT_MAX.toString().length * 2 + 1}
        onKeyDown={handleEnterAndEscapeKeyDown({
          onEnter: createNewRule,
          onEscape: hideNewRuleRow,
        })}
      />
      <PortRangeTooltip id="source-port" />
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
    <OdsFormField
      className="flex flex-row items-center"
      error={destinationPortError}
    >
      <OdsInput
        className="w-full"
        name="destination-port-input"
        value={newDestinationPort}
        isDisabled={newFragments}
        hasError={!!destinationPortError}
        onOdsChange={(e) => {
          const newValue = ((e.detail.value as string) || '').replace(
            /[^0-9-]*/g,
            '',
          );
          setNewDestinationPort(newValue);
          setDestinationPortError(undefined);
        }}
        maxlength={IP_EDGE_FIREWALL_PORT_MAX.toString().length * 2 + 1}
        onKeyDown={handleEnterAndEscapeKeyDown({
          onEnter: createNewRule,
          onEscape: hideNewRuleRow,
        })}
      />
      <PortRangeTooltip id="destination-port" />
    </OdsFormField>
  );
};
