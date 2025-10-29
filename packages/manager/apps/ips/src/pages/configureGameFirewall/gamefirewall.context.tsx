import React from 'react';
import { useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useGetIpGameFirewall, useIpGameFirewallRules } from '@/data/hooks';
import {
  fromIdToIp,
  ipFormatter,
  INVALIDATED_REFRESH_PERIOD,
  TRANSLATION_NAMESPACES,
} from '@/utils';
import {
  addIpGameFirewallRule,
  getGameFirewallRuleQueryKey,
  IpGameFirewallRule,
  IpGameFirewallStateEnum,
} from '@/data/api';
import {
  hasConflictingPorts,
  hasPortRangeError,
  IP_MITIGATION_RULE_PROTOCOL_PORT,
} from './gamefirewall.utils';

export type GameFirewallContextType = {
  isLoading?: boolean;
  isRulesLoading?: boolean;
  rules: IpGameFirewallRule[];
  ip: string;
  ipOnGame?: string;
  isError?: boolean;
  error?: ApiError;
  isRulesError?: boolean;
  rulesError?: ApiError;
  isNewRuleRowDisplayed: boolean;
  hideNewRuleRow: () => void;
  showNewRuleRow: () => void;
  newGameProtocol?: string;
  newStartPort?: string;
  newEndPort?: string;
  setNewGameProtocol: (protocol?: string) => void;
  setNewStartPort: (port?: string) => void;
  setNewEndPort: (port?: string) => void;
  maxRulesReached?: boolean;
  supportedProtocols: string[];
  gameFirewallState?: IpGameFirewallStateEnum;
  firewallModeEnabled?: boolean;
  isStrategyConfirmationModalVisible: boolean;
  showStrategyConfirmationModal: () => void;
  hideStrategyConfirmationModal: () => void;
  isConfirmDeleteModalOpen?: boolean;
  ruleToDelete?: IpGameFirewallRule | null;
  showConfirmDeleteModal: (rule: IpGameFirewallRule) => void;
  hideConfirmDeleteModal: () => void;
  tmpToggleState?: boolean;
  setTmpToggleState: (newToggleState?: boolean) => void;
  addRule: () => void;
};

export const GameFirewallContext = React.createContext<GameFirewallContextType>(
  {
    rules: [],
    ip: '',
    setNewEndPort: () => {},
    setNewStartPort: () => {},
    setNewGameProtocol: () => {},
    isNewRuleRowDisplayed: false,
    showNewRuleRow: () => {},
    hideNewRuleRow: () => {},
    supportedProtocols: [],
    isStrategyConfirmationModalVisible: false,
    showStrategyConfirmationModal: () => {},
    hideStrategyConfirmationModal: () => {},
    isConfirmDeleteModalOpen: false,
    ruleToDelete: null,
    showConfirmDeleteModal: () => {},
    hideConfirmDeleteModal: () => {},
    setTmpToggleState: () => {},
    addRule: () => {},
  },
);

export const GameFirewallContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const qc = useQueryClient();
  const { clearNotifications, addSuccess, addError } = useNotifications();
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.gameFirewall,
    TRANSLATION_NAMESPACES.error,
  ]);
  const { id } = useParams();
  const { ipGroup } = ipFormatter(fromIdToIp(id));
  const [newGameProtocol, setNewGameProtocol] = React.useState<string>();
  const [newStartPort, setNewStartPort] = React.useState<string>();
  const [newEndPort, setNewEndPort] = React.useState<string>();
  // It's a state just to let the toggle animate when we try to change its value
  const [tmpToggleState, setTmpToggleState] = React.useState(null);
  const [isNewRuleRowDisplayed, setIsNewRuleRowDisplayed] = React.useState<
    boolean
  >(false);
  const [
    isStrategyConfirmationModalVisible,
    setIsStrategyConfirmationModalVisible,
  ] = React.useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = React.useState<
    IpGameFirewallRule
  >(null);
  const { isLoading, ipGameFirewall, isError, error } = useGetIpGameFirewall({
    ip: ipGroup,
  });
  const ipOnGame = ipGameFirewall?.[0]?.ipOnGame;

  const hideNewRuleRow = React.useCallback(() => {
    setNewGameProtocol(undefined);
    setNewStartPort(undefined);
    setNewEndPort(undefined);
    setIsNewRuleRowDisplayed(false);
  }, []);

  const {
    isLoading: isRulesLoading,
    data: rules,
    isError: isRulesError,
    error: rulesError,
  } = useIpGameFirewallRules({
    ip: ipGroup,
    ipOnGame,
    refetchInterval: INVALIDATED_REFRESH_PERIOD,
  });

  const { mutate: addRule } = useMutation({
    mutationFn: () => {
      clearNotifications();
      const startPort = parseInt(newStartPort, 10);
      const endPort = parseInt(newEndPort || newStartPort, 10);

      if (!newStartPort) {
        addError(t('missingPortError'), true);
        return Promise.reject();
      }
      if (startPort > endPort) {
        addError(t('startPortGreaterThanEndPortError'), true);
        return Promise.reject();
      }
      if (hasPortRangeError({ startPort, endPort })) {
        addError(t('portRangeError'), true);
        return Promise.reject();
      }
      if (hasConflictingPorts({ startPort, endPort, rules })) {
        addError(t('conflictingRuleError'), true);
        return Promise.reject();
      }

      return addIpGameFirewallRule({
        ip: ipGroup,
        ipOnGame,
        startPort,
        endPort,
        protocol: newGameProtocol,
      });
    },
    onSuccess: () => {
      clearNotifications();
      qc.invalidateQueries({
        queryKey: getGameFirewallRuleQueryKey({ ip: ipGroup, ipOnGame }),
      });
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

  const showNewRuleRow = React.useCallback(
    () => setIsNewRuleRowDisplayed(true),
    [],
  );

  const showStrategyConfirmationModal = React.useCallback(
    () => setIsStrategyConfirmationModalVisible(true),
    [],
  );
  const hideStrategyConfirmationModal = React.useCallback(() => {
    setIsStrategyConfirmationModalVisible(false);
    setTmpToggleState(undefined);
  }, []);
  const showConfirmDeleteModal = React.useCallback(
    (rule: IpGameFirewallRule) => setConfirmDeleteModalOpen(rule),
    [],
  );

  const hideConfirmDeleteModal = React.useCallback(
    () => setConfirmDeleteModalOpen(null),
    [],
  );
  const setNewGameProtocolWithPorts = React.useCallback(
    (protocol?: string) => {
      if (protocol !== newGameProtocol) {
        const associatedPorts = IP_MITIGATION_RULE_PROTOCOL_PORT[protocol];
        setNewGameProtocol(protocol);
        setNewStartPort(associatedPorts?.from?.toString() || undefined);
        setNewEndPort(associatedPorts?.to?.toString() || undefined);
      }
    },
    [newGameProtocol],
  );

  const value = React.useMemo(
    () => ({
      isLoading,
      isRulesLoading,
      rules: rules || [],
      ip: ipGroup,
      ipOnGame,
      isError,
      error,
      isRulesError,
      rulesError,
      isNewRuleRowDisplayed,
      hideNewRuleRow,
      showNewRuleRow,
      isStrategyConfirmationModalVisible,
      showStrategyConfirmationModal,
      hideStrategyConfirmationModal,
      isConfirmDeleteModalOpen: !!confirmDeleteModalOpen,
      ruleToDelete: confirmDeleteModalOpen,
      showConfirmDeleteModal,
      hideConfirmDeleteModal,
      newGameProtocol,
      newStartPort,
      newEndPort,
      setNewGameProtocol: setNewGameProtocolWithPorts,
      setNewStartPort,
      setNewEndPort,
      maxRulesReached: ipGameFirewall?.[0]?.maxRules === rules?.length,
      supportedProtocols: ipGameFirewall?.[0]?.supportedProtocols || [],
      firewallModeEnabled: ipGameFirewall?.[0]?.firewallModeEnabled,
      gameFirewallState: ipGameFirewall?.[0]?.state,
      tmpToggleState,
      setTmpToggleState,
      addRule,
    }),
    [
      isLoading,
      isRulesLoading,
      rules,
      ipGroup,
      ipOnGame,
      isError,
      error,
      isRulesError,
      rulesError,
      isNewRuleRowDisplayed,
      hideNewRuleRow,
      isStrategyConfirmationModalVisible,
      confirmDeleteModalOpen,
      newGameProtocol,
      newStartPort,
      newEndPort,
      ipGameFirewall,
      tmpToggleState,
      addRule,
      ipGameFirewall,
    ],
  );

  return (
    <GameFirewallContext.Provider value={value}>
      {children}
    </GameFirewallContext.Provider>
  );
};
