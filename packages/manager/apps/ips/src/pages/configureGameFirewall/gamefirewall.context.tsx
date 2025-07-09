import React from 'react';
import { useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useGetIpGameFirewall, useIpGameFirewallRules } from '@/data/hooks';
import { fromIdToIp, ipFormatter } from '@/utils';
import { IpGameFirewallRule, IpGameFirewallStateEnum } from '@/data/api';
import { IP_MITIGATION_RULE_PROTOCOL_PORT } from './gamefirewall.utils';

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
  },
);

export const GameFirewallContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
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
  });

  const value = {
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
    showNewRuleRow: React.useCallback(() => setIsNewRuleRowDisplayed(true), []),
    isStrategyConfirmationModalVisible,
    showStrategyConfirmationModal: React.useCallback(
      () => setIsStrategyConfirmationModalVisible(true),
      [],
    ),
    hideStrategyConfirmationModal: React.useCallback(() => {
      setIsStrategyConfirmationModalVisible(false);
      setTmpToggleState(undefined);
    }, []),
    isConfirmDeleteModalOpen: !!confirmDeleteModalOpen,
    ruleToDelete: confirmDeleteModalOpen,
    showConfirmDeleteModal: React.useCallback(
      (rule: IpGameFirewallRule) => setConfirmDeleteModalOpen(rule),
      [],
    ),
    hideConfirmDeleteModal: React.useCallback(
      () => setConfirmDeleteModalOpen(null),
      [],
    ),
    newGameProtocol,
    newStartPort,
    newEndPort,
    setNewGameProtocol: React.useCallback((protocol?: string) => {
      const associatedPorts = IP_MITIGATION_RULE_PROTOCOL_PORT[protocol];
      setNewGameProtocol(protocol);
      setNewStartPort(associatedPorts?.from?.toString() || undefined);
      setNewEndPort(associatedPorts?.to?.toString() || undefined);
    }, []),
    setNewStartPort,
    setNewEndPort,
    maxRulesReached: ipGameFirewall?.[0]?.maxRules === rules?.length,
    supportedProtocols: ipGameFirewall?.[0]?.supportedProtocols || [],
    firewallModeEnabled: ipGameFirewall?.[0]?.firewallModeEnabled,
    gameFirewallState: ipGameFirewall?.[0]?.state,
    tmpToggleState,
    setTmpToggleState,
  };

  return (
    <GameFirewallContext.Provider value={value}>
      {children}
    </GameFirewallContext.Provider>
  );
};
