import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  getIpEdgeFirewallQueryKey,
  getIpEdgeNetworkFirewallRuleListQueryKey,
  IpEdgeFirewallProtocol,
  postIpEdgeFirewall,
  postIpEdgeNetworkFirewallRule,
} from '@/data/api';
import { isValidIpv4Block, TRANSLATION_NAMESPACES } from '@/utils';

export const IP_EDGE_FIREWALL_PORT_MIN = 0;
export const IP_EDGE_FIREWALL_PORT_MAX = 65535;

export const hasPortRangeError = (port: string) => {
  const portNumber = parseInt(port, 10);
  return (
    portNumber < IP_EDGE_FIREWALL_PORT_MIN ||
    portNumber > IP_EDGE_FIREWALL_PORT_MAX
  );
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
}: {
  ip: string;
  ipOnFirewall: string;
  hasNoFirewall: boolean;
  hideNewRuleRow: () => void;
} & CreateFirewallRuleParams) => {
  const qc = useQueryClient();
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.edgeNetworkFirewall,
    TRANSLATION_NAMESPACES.error,
  ]);
  const { addSuccess, addError, clearNotifications } = useNotifications();
  return useMutation({
    mutationFn: async () => {
      clearNotifications();

      if (hasPortRangeError(sourcePort) || hasPortRangeError(destinationPort)) {
        addError(t('portRangeError'), true);
        return Promise.reject();
      }

      if (
        source &&
        source.length > 0 &&
        (!isValidIpv4Block(source) || source.includes('0.0.0.0'))
      ) {
        addError(t('invalidSourceError'), true);
        return Promise.reject();
      }

      if (hasNoFirewall) {
        await postIpEdgeFirewall({ ip, ipOnFirewall });
      }

      return postIpEdgeNetworkFirewallRule({
        ip,
        ipOnFirewall,
        action,
        protocol,
        destinationPort:
          destinationPort && !fragments ? parseInt(destinationPort, 10) : null,
        sequence,
        source,
        sourcePort: sourcePort && !fragments ? parseInt(sourcePort, 10) : null,
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
          queryKey: getIpEdgeFirewallQueryKey({ ip: ipOnFirewall }),
        });
      }

      addSuccess(t('add_rule_success_message'), true);
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
      }
    },
  });
};
