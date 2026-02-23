import {
  Dispatch,
  SetStateAction,
  FC,
  ReactNode,
  useState,
  useCallback,
  createContext,
  useMemo,
} from 'react';

import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  IpEdgeFirewallProtocol,
  IpEdgeFirewallRule,
  IpEdgeFirewallStateEnum,
  getIpList,
} from '@/data/api';
import {
  useCreateIpEdgeNetworkFirewallRule,
  useGetIpEdgeFirewall,
  useIpEdgeNetworkFirewallRules,
} from '@/data/hooks';
import { fromIdToIp, ipFormatter } from '@/utils';

export const MAX_RULES_NUMBER = 20;

export type EdgeNetworkFirewallContextType = {
  isLoading?: boolean;
  isRulesLoading?: boolean;
  rules: IpEdgeFirewallRule[];
  ruleSequenceList: number[];
  ip: string;
  ipOnFirewall?: string;
  isError?: boolean;
  error?: ApiError | null;
  isRulesError?: boolean;
  rulesError?: ApiError | null;
  isNewRuleRowDisplayed: boolean;
  hideNewRuleRow: () => void;
  showNewRuleRow: () => void;
  createNewRule: () => void;

  newSequence?: number;
  newMode?: 'permit' | 'deny';
  newSource?: string;
  newProtocol?: IpEdgeFirewallProtocol;
  newSourcePort?: string;
  newDestinationPort?: string;
  newFragments?: boolean;
  newTcpOption?: 'established' | 'syn';

  sourceError?: string;
  sourcePortError?: string;
  destinationPortError?: string;
  modeError?: string;
  protocolError?: string;
  setSourceError: (error?: string) => void;
  setSourcePortError: (error?: string) => void;
  setDestinationPortError: (error?: string) => void;
  setModeError: (error?: string) => void;
  setProtocolError: (error?: string) => void;

  setNewSequence: (sequence?: number) => void;
  setNewMode: (mode?: 'permit' | 'deny') => void;
  setNewSource: (source?: string) => void;
  setNewProtocol: (protocol?: IpEdgeFirewallProtocol) => void;
  setNewSourcePort: (port?: string) => void;
  setNewDestinationPort: (port?: string) => void;
  setNewFragments: (fragments?: boolean) => void;
  setNewTcpOption: (tcpOption?: 'established' | 'syn') => void;

  maxRulesReached?: boolean;
  hasNoFirewall?: boolean;
  firewallState?: IpEdgeFirewallStateEnum;
  firewallModeEnabled?: boolean;
  isEnableFirewallModalVisible: boolean;
  showEnableFirewallModal: () => void;
  hideEnableFirewallModal: () => void;
  isConfirmDeleteModalOpen?: boolean;
  ruleToDelete?: IpEdgeFirewallRule | null;
  showConfirmDeleteModal: (rule: IpEdgeFirewallRule) => void;
  hideConfirmDeleteModal: () => void;
  tmpToggleState?: boolean | null;
  setTmpToggleState: Dispatch<SetStateAction<boolean | null>>;
};

export const EdgeNetworkFirewallContext =
  createContext<EdgeNetworkFirewallContextType>({
    rules: [],
    ruleSequenceList: [],
    ip: '',
    setNewDestinationPort: () => {},
    setNewSourcePort: () => {},
    setNewProtocol: () => {},
    setNewMode: () => {},
    setNewSource: () => {},
    setNewSequence: () => {},
    setNewFragments: () => {},
    setNewTcpOption: () => {},
    isNewRuleRowDisplayed: false,
    showNewRuleRow: () => {},
    hideNewRuleRow: () => {},
    createNewRule: () => {},
    isEnableFirewallModalVisible: false,
    showEnableFirewallModal: () => {},
    hideEnableFirewallModal: () => {},
    isConfirmDeleteModalOpen: false,
    ruleToDelete: null,
    showConfirmDeleteModal: () => {},
    hideConfirmDeleteModal: () => {},
    setTmpToggleState: () => {},
    sourceError: undefined,
    sourcePortError: undefined,
    destinationPortError: undefined,
    modeError: undefined,
    protocolError: undefined,
    setSourceError: () => {},
    setSourcePortError: () => {},
    setDestinationPortError: () => {},
    setModeError: () => {},
    setProtocolError: () => {},
  });

export const EdgeFirewallContextProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { id } = useParams();
  const { ipGroup, ipAddress: ipOnFirewall } = ipFormatter(fromIdToIp(id));
  const [newSequence, setNewSequence] = useState<number>();
  const [newMode, setNewMode] = useState<'permit' | 'deny'>();
  const [newProtocol, setNewProtocol] = useState<IpEdgeFirewallProtocol>();
  const [newSource, setNewSource] = useState<string>();
  const [newSourcePort, setNewSourcePort] = useState<string>();
  const [newDestinationPort, setNewDestinationPort] = useState<string>();
  const [newFragments, setNewFragments] = useState<boolean>();
  const [newTcpOption, setNewTcpOption] = useState<
    'established' | 'syn' | undefined
  >();
  // It's a state just to let the toggle animate when we try to change its value
  const [tmpToggleState, setTmpToggleState] = useState<boolean | null>(null);
  const [isNewRuleRowDisplayed, setIsNewRuleRowDisplayed] = useState(false);
  const [isEnableFirewallModalVisible, setIsEnableFirewallModalVisible] =
    useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] =
    useState<IpEdgeFirewallRule | null>(null);
  const [sourceError, setSourceError] = useState<string>();
  const [sourcePortError, setSourcePortError] = useState<string>();
  const [destinationPortError, setDestinationPortError] = useState<string>();
  const [modeError, setModeError] = useState<string>();
  const [protocolError, setProtocolError] = useState<string>();

  const { data, isLoading: isParentIpLoading } = useQuery<
    ApiResponse<string[]>,
    ApiError
  >({
    queryKey: ['get/ipList', ipOnFirewall],
    queryFn: () => getIpList({ ip: ipOnFirewall }),
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const ip = data?.data?.[0] || ipGroup;

  const { isLoading, ipEdgeFirewall, isError, error } = useGetIpEdgeFirewall({
    ip,
    ipOnFirewall,
    enabled: !!ipOnFirewall && !isParentIpLoading,
  });

  const hasNoFirewall = useMemo(
    () => ipEdgeFirewall === null,
    [ipEdgeFirewall],
  );

  const hideNewRuleRow = useCallback(() => {
    setNewSequence(undefined);
    setNewMode(undefined);
    setNewSource(undefined);
    setNewProtocol(undefined);
    setNewSourcePort(undefined);
    setNewDestinationPort(undefined);
    setNewFragments(undefined);
    setNewTcpOption(undefined);
    setIsNewRuleRowDisplayed(false);
  }, []);

  const { mutate: createNewRule } = useCreateIpEdgeNetworkFirewallRule({
    ip,
    ipOnFirewall,
    hasNoFirewall,
    hideNewRuleRow,
    source: newSource,
    sourcePort: newSourcePort,
    destinationPort: newDestinationPort,
    action: newMode,
    protocol: newProtocol,
    sequence: newSequence,
    tcpOption: newTcpOption,
    fragments: newFragments,
    setSourceError,
    setSourcePortError,
    setDestinationPortError,
    setModeError,
    setProtocolError,
  });

  const {
    isLoading: isRulesLoading,
    data: rules,
    isError: isRulesError,
    error: rulesError,
  } = useIpEdgeNetworkFirewallRules({
    ip,
    ipOnFirewall,
  });

  const value = {
    isLoading,
    isRulesLoading,
    hasNoFirewall,
    rules: rules || [],
    ruleSequenceList: (rules || [])?.map((rule) => rule?.sequence),
    ip,
    ipOnFirewall,
    isError,
    error,
    isRulesError,
    rulesError,
    isNewRuleRowDisplayed,
    hideNewRuleRow,
    showNewRuleRow: useCallback(() => setIsNewRuleRowDisplayed(true), []),
    isEnableFirewallModalVisible,
    showEnableFirewallModal: useCallback(
      () => setIsEnableFirewallModalVisible(true),
      [],
    ),
    hideEnableFirewallModal: useCallback(() => {
      setIsEnableFirewallModalVisible(false);
      setTmpToggleState(null);
    }, []),
    isConfirmDeleteModalOpen: !!confirmDeleteModalOpen,
    ruleToDelete: confirmDeleteModalOpen,
    showConfirmDeleteModal: useCallback(
      (rule: IpEdgeFirewallRule) => setConfirmDeleteModalOpen(rule),
      [],
    ),
    hideConfirmDeleteModal: useCallback(
      () => setConfirmDeleteModalOpen(null),
      [],
    ),
    createNewRule,
    setNewProtocol: useCallback((protocol?: IpEdgeFirewallProtocol) => {
      setNewProtocol(protocol);
      setNewSourcePort(undefined);
      setNewDestinationPort(undefined);
      setNewTcpOption(undefined);
      setNewFragments(undefined);
    }, []),
    setNewSourcePort,
    setNewDestinationPort,
    setNewSequence,
    setNewMode,
    setNewSource,
    setNewFragments,
    setNewTcpOption,
    maxRulesReached: rules?.length === MAX_RULES_NUMBER,
    firewallModeEnabled: ipEdgeFirewall?.enabled,
    firewallState: ipEdgeFirewall?.state,
    tmpToggleState,
    setTmpToggleState,
    newSequence,
    newMode,
    newSource,
    newProtocol,
    newSourcePort,
    newDestinationPort,
    newFragments,
    newTcpOption,
    sourceError,
    sourcePortError,
    destinationPortError,
    modeError,
    protocolError,
    setSourceError,
    setSourcePortError,
    setDestinationPortError,
    setModeError,
    setProtocolError,
  };

  return (
    <EdgeNetworkFirewallContext.Provider value={value}>
      {children}
    </EdgeNetworkFirewallContext.Provider>
  );
};
