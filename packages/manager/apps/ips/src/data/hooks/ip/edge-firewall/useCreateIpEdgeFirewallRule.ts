import { useMutation, useQueryClient } from '@tanstack/react-query';
import ipaddr from 'ipaddr.js';
import { useTranslation } from 'react-i18next';

import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import {
  IpEdgeFirewallProtocol,
  getIpEdgeFirewallQueryKey,
  getIpEdgeNetworkFirewallRuleListQueryKey,
  postIpEdgeFirewall,
  postIpEdgeNetworkFirewallRule,
} from '@/data/api';
import { TRANSLATION_NAMESPACES, isValidIpv4Block } from '@/utils';

export const IP_EDGE_FIREWALL_PORT_MIN = 0;
export const IP_EDGE_FIREWALL_PORT_MAX = 65535;

export const hasPortRangeError = (port?: string) => {
  if (!port) {
    return false;
  }

  if (!port.includes('-')) {
    const portNumber = parseInt(port, 10);

    return (
      portNumber < IP_EDGE_FIREWALL_PORT_MIN ||
      portNumber > IP_EDGE_FIREWALL_PORT_MAX
    );
  }

  const parts = port.split('-');

  if (parts.length !== 2) {
    return true;
  }

  const [startPort, endPort] = parts;

  const startPortNumber = startPort
    ? parseInt(startPort, 10)
    : IP_EDGE_FIREWALL_PORT_MIN;
  const endPortNumber = endPort
    ? parseInt(endPort, 10)
    : IP_EDGE_FIREWALL_PORT_MAX;

  return (
    startPortNumber < IP_EDGE_FIREWALL_PORT_MIN ||
    endPortNumber > IP_EDGE_FIREWALL_PORT_MAX ||
    startPortNumber > endPortNumber
  );
};

export const hasDestinationPortLowerThanSourcePortError = ({
  source,
  destination,
}: {
  source?: string;
  destination?: string;
}) => {
  if (
    !source ||
    !destination ||
    source.includes('-') ||
    destination.includes('-')
  ) {
    return false;
  }

  const sourcePortNumber = parseInt(source, 10);
  const destinationPortNumber = parseInt(destination, 10);

  return destinationPortNumber < sourcePortNumber;
};

const isValidEmptySourceValue = (source?: string) =>
  !source ||
  source.length === 0 ||
  ['0.0.0.0', '0.0.0.0/0', 'any', 'all'].includes(source.toLowerCase());

export const hasSourceError = (source?: string) => {
  if (isValidEmptySourceValue(source)) {
    return false;
  }

  return source?.includes('/')
    ? !isValidIpv4Block(source)
    : !ipaddr.IPv4.isValid(source);
};

export const formatSourceValue = (source?: string) => {
  if (isValidEmptySourceValue(source)) {
    return null;
  }
  return !source?.includes('/') ? `${source}/32` : source;
};

export const formatPortValue = (port?: string) => {
  if (!port || port.includes('-')) {
    return undefined;
  }

  return parseInt(port, 10);
};

export const formatPortRangeValue = (port?: string) => {
  if (!port || !port.includes('-')) {
    return undefined;
  }

  const [startPort, endPort] = port.split('-');

  return {
    from: startPort ? parseInt(startPort, 10) : IP_EDGE_FIREWALL_PORT_MIN,
    to: endPort ? parseInt(endPort, 10) : IP_EDGE_FIREWALL_PORT_MAX,
  };
};

export type CreateFirewallRuleParams = {
  action: 'permit' | 'deny';
  protocol: IpEdgeFirewallProtocol;
  sequence: number;
  source?: string;
  sourcePort?: string;
  destinationPort?: string;
  tcpOption?: 'established' | 'syn';
  fragments?: boolean;
};

export const useCreateIpEdgeNetworkFirewallRule = ({
  ip,
  ipOnFirewall,
  hasNoFirewall,
  hideNewRuleRow,
  source,
  sourcePort,
  destinationPort,
  action,
  protocol,
  sequence,
  tcpOption,
  fragments,
  setSourceError,
  setSourcePortError,
  setDestinationPortError,
  setModeError,
  setProtocolError,
}: {
  ip: string;
  ipOnFirewall: string;
  hasNoFirewall: boolean;
  hideNewRuleRow: () => void;
  setSourcePortError: (error?: string) => void;
  setDestinationPortError: (error?: string) => void;
  setSourceError: (error?: string) => void;
  setModeError: (error?: string) => void;
  setProtocolError: (error?: string) => void;
} & CreateFirewallRuleParams) => {
  const qc = useQueryClient();
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.edgeNetworkFirewall,
    TRANSLATION_NAMESPACES.error,
  ]);
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { trackPage } = useOvhTracking();
  return useMutation({
    mutationFn: async () => {
      clearNotifications();
      let hasError = false;

      if (!protocol) {
        setProtocolError(t('requiredFieldError'));
        hasError = true;
      } else {
        setProtocolError(undefined);
      }

      if (!action) {
        setModeError(t('requiredFieldError'));
        hasError = true;
      } else {
        setModeError(undefined);
      }

      if (hasPortRangeError(sourcePort)) {
        setSourcePortError(t('portRangeError'));
        hasError = true;
      } else {
        setSourcePortError(undefined);
      }

      if (hasPortRangeError(destinationPort)) {
        setSourcePortError(t('portRangeError'));
        hasError = true;
      } else {
        setDestinationPortError(undefined);
      }

      if (
        hasDestinationPortLowerThanSourcePortError({
          source: sourcePort,
          destination: destinationPort,
        })
      ) {
        setDestinationPortError(t('destinationPortLowerThanSourcePortError'));
        hasError = true;
      } else {
        setDestinationPortError(undefined);
      }

      if (hasSourceError(source)) {
        setSourceError(t('invalidSourceError'));
        hasError = true;
      } else {
        setSourceError(undefined);
      }

      if (hasError) {
        addError(t('createRuleErrorMessage'), true);
        trackPage({
          pageType: PageType.bannerError,
          pageName: 'edge_firewall_add_rule_error',
        });
        return Promise.reject(new Error('Validation errors'));
      }

      if (hasNoFirewall) {
        await postIpEdgeFirewall({ ip, ipOnFirewall });
      }

      return postIpEdgeNetworkFirewallRule({
        ip,
        ipOnFirewall,
        action,
        protocol,
        destinationPort: fragments
          ? undefined
          : formatPortValue(destinationPort),
        sourcePort: fragments ? undefined : formatPortValue(sourcePort),
        destinationPortRange: fragments
          ? undefined
          : formatPortRangeValue(destinationPort),
        sourcePortRange: fragments
          ? undefined
          : formatPortRangeValue(sourcePort),
        sequence,
        source: formatSourceValue(source),
        tcpOption:
          fragments || tcpOption
            ? {
                fragments,
                option: tcpOption,
              }
            : null,
      });
    },
    onSuccess: () => {
      clearNotifications();
      qc.invalidateQueries({
        queryKey: getIpEdgeNetworkFirewallRuleListQueryKey({
          ip,
          ipOnFirewall,
        }),
      });

      if (hasNoFirewall) {
        qc.invalidateQueries({
          queryKey: getIpEdgeFirewallQueryKey({ ip, ipOnFirewall }),
        });
      }

      addSuccess(t('add_rule_success_message'), true);
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'edge_firewall_add_rule_success',
      });
      hideNewRuleRow();
    },
    onError: (err?: ApiError) => {
      if (err) {
        clearNotifications();
        addError(
          t('managerApiError', {
            ns: TRANSLATION_NAMESPACES.error,
            error: err?.response?.data?.message,
            ovhQueryId: err?.response?.headers?.['x-ovh-queryid'],
          }),
          true,
        );
        trackPage({
          pageType: PageType.bannerError,
          pageName: 'edge_firewall_add_rule_error',
        });
      }
    },
  });
};
