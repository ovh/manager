import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  getVcdOrganisationNetworkAclList,
  getVcdNetworkAclListQueryKey,
  VCDNetworkAcl,
  VCDNetworkAclNetwork,
  useVcdOrganization,
  isStatusTerminated,
  VCDNetworkAclResourceStatus,
} from '@ovh-ux/manager-module-vcd-api';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';

const INTERVAL_POLLING = 2 * 1000; // 2s
const ACTIVE_TASK_STATUS = ['PENDING', 'RUNNING'];
const RUNNING_RSSOURCE_STATUS = ['CREATING', 'UPDATING', 'DELETING'];

export const checkHasActiveTasks = (
  data: VCDNetworkAcl[] | undefined,
): boolean => {
  return (
    data?.some((item) =>
      item.currentTasks?.some((task) =>
        ACTIVE_TASK_STATUS.includes(task.status),
      ),
    ) ?? false
  );
};

export const checkResourceStatus = (
  data: VCDNetworkAcl[] | undefined,
): boolean => {
  return (
    data?.some((item) =>
      RUNNING_RSSOURCE_STATUS.includes(item.resourceStatus),
    ) ?? false
  );
};

export type NetworkAclStatus = 'ACTIVE' | 'DELETING' | 'CREATING';
export type NetworkWithStatus = VCDNetworkAclNetwork & {
  status: NetworkAclStatus;
};

interface NetworkAclContextValue {
  networks: NetworkWithStatus[];
  currentNetworks: VCDNetworkAclNetwork[];
  targetNetworks: VCDNetworkAclNetwork[];
  organisationId: string;
  aclId: string;
  hasActiveTasks: boolean;
  isPending: boolean;
  isError: boolean;
  isActiveOrganisation: boolean;
  resourceStatus: VCDNetworkAclResourceStatus;
  error: ApiError;
}

const NetworkAclContext = createContext<NetworkAclContextValue | null>(null);

export function NetworkAclProvider({ children }: { children: ReactNode }) {
  const { id } = useParams();
  const { data: vcdOrganisation } = useVcdOrganization({ id });
  const { flattenData, isPending, isError, error } = useResourcesIcebergV2<
    VCDNetworkAcl
  >({
    route: getVcdOrganisationNetworkAclList(id),
    queryKey: getVcdNetworkAclListQueryKey(id),
    refetchInterval: (query) => {
      const pages = query.state.data?.pages;
      if (!pages || pages.length === 0) return false;

      const flatData = pages.flatMap((page) => page.data);
      return checkHasActiveTasks(flatData) || checkResourceStatus(flatData)
        ? INTERVAL_POLLING
        : false;
    },
  });

  const acl = useMemo(() => {
    return Array.isArray(flattenData) && flattenData.length > 0
      ? flattenData[0]
      : null;
  }, [flattenData]);

  const targetNetworks = useMemo<VCDNetworkAclNetwork[]>(() => {
    return acl?.targetSpec?.networks ?? [];
  }, [acl]);

  const currentNetworks = useMemo<VCDNetworkAclNetwork[]>(() => {
    return acl?.currentState?.networks ?? [];
  }, [acl]);

  const networks = useMemo<NetworkWithStatus[]>(() => {
    if (!acl) return [];

    const currentMap = new Map(currentNetworks.map((n) => [n.network, n]));
    const targetMap = new Map(targetNetworks.map((n) => [n.network, n]));

    const activeOrDeleting: NetworkWithStatus[] = currentNetworks.map(
      (curr) => ({
        ...curr,
        status: (targetMap.has(curr.network)
          ? 'ACTIVE'
          : 'DELETING') as NetworkAclStatus,
      }),
    );

    const creating: NetworkWithStatus[] = targetNetworks
      .filter((targ) => !currentMap.has(targ.network))
      .map((targ) => ({ ...targ, status: 'CREATING' as NetworkAclStatus }));

    return [...activeOrDeleting, ...creating];
  }, [acl, currentNetworks, targetNetworks]);

  const aclId = useMemo(() => {
    return acl && currentNetworks.length > 0 ? acl.id : '';
  }, [acl, currentNetworks]);

  const hasActiveTasks = useMemo(() => {
    return checkHasActiveTasks(flattenData) || checkResourceStatus(flattenData);
  }, [flattenData]);

  return (
    <NetworkAclContext.Provider
      value={{
        networks,
        currentNetworks,
        targetNetworks,
        organisationId: id,
        isActiveOrganisation: !isStatusTerminated(
          vcdOrganisation?.data?.resourceStatus,
        ),
        aclId,
        hasActiveTasks,
        isPending,
        isError,
        resourceStatus: acl?.resourceStatus,
        error: error as ApiError,
      }}
    >
      {children}
    </NetworkAclContext.Provider>
  );
}

export function useNetworkAclContext() {
  const context = useContext(NetworkAclContext);
  if (!context) {
    throw new Error('useNetworkAcl must be used within NetworkAclProvider');
  }
  return context;
}
