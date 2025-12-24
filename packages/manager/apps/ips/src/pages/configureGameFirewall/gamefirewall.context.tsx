import {
  Dispatch,
  SetStateAction,
  useMemo,
  useCallback,
  createContext,
  useState,
  ReactNode,
  FC,
} from 'react';

import { useParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import {
  IpGameFirewallRule,
  IpGameFirewallStateEnum,
  addIpGameFirewallRule,
  getGameFirewallRuleQueryKey,
} from '@/data/api';
import { useGetIpGameFirewall, useIpGameFirewallRules } from '@/data/hooks';
import { TRANSLATION_NAMESPACES, fromIdToIp } from '@/utils';

import {
  IP_MITIGATION_RULE_PROTOCOL_PORT,
  PORT_MIN,
  hasConflictingPorts,
  hasPortRangeError,
} from './gamefirewall.utils';

export type GameFirewallContextType = {
  isLoading?: boolean;
  isRulesLoading?: boolean;
  rules: IpGameFirewallRule[];
  ip: string;
  ipOnGame: string;
  isError?: boolean;
  error?: ApiError | null;
  isRulesError?: boolean;
  rulesError?: ApiError | null;
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
  setTmpToggleState: Dispatch<SetStateAction<boolean>>;
  addRule: () => void;
};

export const GameFirewallContext = createContext<GameFirewallContextType>({
  rules: [],
  ip: '',
  ipOnGame: '',
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
});

export const GameFirewallContextProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const qc = useQueryClient();
  const { clearNotifications, addSuccess, addError } = useNotifications();
  const { trackPage } = useOvhTracking();
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.gameFirewall,
    TRANSLATION_NAMESPACES.error,
  ]);
  const { parentId, id } = useParams();
  const ip = fromIdToIp(parentId);
  const ipOnGame = fromIdToIp(id);
  const [newGameProtocol, setNewGameProtocol] = useState<string>();
  const [newStartPort, setNewStartPort] = useState<string>();
  const [newEndPort, setNewEndPort] = useState<string>();
  // It's a state just to let the toggle animate when we try to change its value
  const [tmpToggleState, setTmpToggleState] = useState<boolean>(false);
  const [isNewRuleRowDisplayed, setIsNewRuleRowDisplayed] = useState<boolean>(
    false,
  );
  const [
    isStrategyConfirmationModalVisible,
    setIsStrategyConfirmationModalVisible,
  ] = useState(false);
  const [
    confirmDeleteModalOpen,
    setConfirmDeleteModalOpen,
  ] = useState<IpGameFirewallRule | null>(null);
  const { isLoading, ipGameFirewall, isError, error } = useGetIpGameFirewall({
    ip,
    ipOnGame,
  });

  const hideNewRuleRow = useCallback(() => {
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
    ip,
    ipOnGame,
  });

  const { mutate: addRule } = useMutation({
    mutationFn: () => {
      clearNotifications();
      let hasError = false;
      const startPort = newStartPort ? parseInt(newStartPort, 10) : PORT_MIN;
      const endPort = newEndPort ? parseInt(newEndPort, 10) : startPort;

      if (!newGameProtocol) {
        addError(t('missingProtocolError'), true);
        hasError = true;
      }

      if (!newStartPort) {
        addError(t('missingPortError'), true);
        hasError = true;
      }

      if (startPort > endPort) {
        addError(t('startPortGreaterThanEndPortError'), true);
        hasError = true;
      }

      if (hasPortRangeError({ startPort, endPort })) {
        addError(t('portRangeError'), true);
        hasError = true;
      }

      if (
        hasConflictingPorts({
          startPort,
          endPort,
          rules,
        })
      ) {
        addError(t('conflictingRuleError'), true);
        hasError = true;
      }

      return hasError
        ? Promise.reject(new Error('Validation errors'))
        : addIpGameFirewallRule({
            ip,
            ipOnGame,
            startPort,
            endPort,
            protocol: newGameProtocol,
          });
    },
    onSuccess: () => {
      clearNotifications();
      qc.invalidateQueries({
        queryKey: getGameFirewallRuleQueryKey({ ip, ipOnGame }),
      });
      addSuccess(t('add_rule_success_message'), true);
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'configure_game-firewall_add-rule_success',
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
          pageName: 'configure_game-firewall_add-rule_error',
        });
      }
    },
  });

  const showNewRuleRow = useCallback(() => setIsNewRuleRowDisplayed(true), []);

  const showStrategyConfirmationModal = useCallback(
    () => setIsStrategyConfirmationModalVisible(true),
    [],
  );
  const hideStrategyConfirmationModal = useCallback(() => {
    setIsStrategyConfirmationModalVisible(false);
    setTmpToggleState(false);
  }, []);
  const showConfirmDeleteModal = useCallback(
    (rule: IpGameFirewallRule) => setConfirmDeleteModalOpen(rule),
    [],
  );

  const hideConfirmDeleteModal = useCallback(
    () => setConfirmDeleteModalOpen(null),
    [],
  );
  const setNewGameProtocolWithPorts = useCallback(
    (protocol?: string) => {
      if (protocol !== newGameProtocol) {
        const associatedPorts = protocol
          ? IP_MITIGATION_RULE_PROTOCOL_PORT[protocol]
          : null;
        setNewGameProtocol(protocol);
        setNewStartPort(associatedPorts?.from?.toString() || undefined);
        setNewEndPort(associatedPorts?.to?.toString() || undefined);
      }
    },
    [newGameProtocol],
  );

  const value = useMemo(
    () => ({
      isLoading,
      isRulesLoading,
      rules: rules || [],
      ip,
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
      maxRulesReached: ipGameFirewall?.maxRules === rules?.length,
      supportedProtocols:
        ipGameFirewall?.supportedProtocols ||
        Object.keys(IP_MITIGATION_RULE_PROTOCOL_PORT),
      firewallModeEnabled: ipGameFirewall?.firewallModeEnabled,
      gameFirewallState: ipGameFirewall?.state,
      tmpToggleState,
      setTmpToggleState,
      addRule,
    }),
    [
      isLoading,
      isRulesLoading,
      rules,
      ip,
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
      setNewGameProtocolWithPorts,
    ],
  );

  return (
    <GameFirewallContext.Provider value={value}>
      {children}
    </GameFirewallContext.Provider>
  );
};
