import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovh-ux/manager-react-components';
import {
  UndefinedInitialDataOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TKube, TOidcProvider } from '@/types';
import queryClient from '@/queryClient';
import { paginateResults, REFETCH_INTERVAL_DURATION } from '@/helpers';
import { STATUS } from '@/constants';
import {
  addOidcProvider,
  createSubscription,
  deleteSubscription,
  createKubernetesCluster,
  getAllKube,
  getClusterRestrictions,
  getKubernetesCluster,
  getOidcProvider,
  getSubscribedLogs,
  KubeClusterCreationParams,
  postKubeConfig,
  removeOidcProvider,
  resetCluster,
  resetKubeConfig,
  terminateCluster,
  TResetClusterParams,
  updateKubePolicy,
  updateKubernetesCluster,
  updateKubeVersion,
  updateOidcProvider,
  getKubeEtcdUsage,
} from '../data/kubernetes';
import { getPrivateNetworkName } from '../data/network';
import { useAllPrivateNetworks } from './useNetwork';
import { mapPluginsFromArrayToObject } from '../data/plugins';

export const getAllKubeQueryKey = (projectId: string) => [
  'project',
  projectId,
  'kube',
];

export const useAllKube = (
  projectId: string,
  options?: Partial<UndefinedInitialDataOptions<TKube[]>>,
) =>
  useQuery({
    queryKey: getAllKubeQueryKey(projectId),
    queryFn: (): Promise<Required<TKube[]>> => getAllKube(projectId),
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    ...(options || {}),
  });

export const useKubes = (
  projectId: string,
  pagination: PaginationState,
  filters: Filter[],
) => {
  const { t } = useTranslation('listing');

  const {
    data: allKube,
    error: allKubeError,
    isLoading: isAllKubeLoading,
    isPending: isAllKubePending,
  } = useAllKube(projectId, { refetchInterval: REFETCH_INTERVAL_DURATION });

  const {
    data: privateNetworks,
    error: networksError,
    isLoading: isNetworksLoading,
    isPending: isNetworksPending,
  } = useAllPrivateNetworks(projectId);

  return useMemo(() => {
    const result = allKube?.map((kube) => ({
      ...kube,
      attachedTo: kube.privateNetworkId
        ? getPrivateNetworkName(privateNetworks, kube.privateNetworkId)
        : t('kube_list_network_public'),
    }));

    return {
      isLoading: isAllKubeLoading || isNetworksLoading,
      isPending: isAllKubePending || isNetworksPending,
      data: paginateResults<TKube>(
        applyFilters(result || [], filters),
        pagination,
      ),
      error: allKubeError || networksError,
    };
  }, [
    allKube,
    allKubeError,
    isAllKubeLoading,
    isAllKubePending,
    privateNetworks,
    networksError,
    isNetworksLoading,
    isNetworksPending,
    pagination,
    filters,
  ]);
};

export function getKubernetesClusterQuery(projectId: string, kubeId: string) {
  return ['project', projectId, 'kube', kubeId];
}

export const useKubernetesCluster = (
  projectId: string,
  kubeId: string,
  options?: Partial<UndefinedInitialDataOptions<TKube>>,
) =>
  useQuery({
    queryKey: getKubernetesClusterQuery(projectId, kubeId),
    queryFn: () => getKubernetesCluster(projectId, kubeId),
    select: (data: TKube) => {
      const { admissionPlugins } = data.customization.apiServer || {};
      const plugins = mapPluginsFromArrayToObject(admissionPlugins);
      return {
        ...data,
        isClusterReady: data.status === STATUS.READY,
        ...(plugins.length && {
          plugins,
        }),
      };
    },
    ...(options || {}),
  });

type RenameKubernetesClusterProps = {
  projectId: string;
  kubeId: string;
  name: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useRenameKubernetesCluster = ({
  projectId,
  kubeId,
  name,
  onError,
  onSuccess,
}: RenameKubernetesClusterProps) => {
  const mutation = useMutation({
    mutationFn: async () =>
      updateKubernetesCluster(projectId, kubeId, { name }),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getKubernetesClusterQuery(projectId, kubeId),
      });
      await queryClient.invalidateQueries({
        queryKey: getAllKubeQueryKey(projectId),
      });
      onSuccess();
    },
  });
  return {
    renameCluster: () => mutation.mutate(),
    ...mutation,
  };
};

type ResetKubeConfigProps = {
  projectId: string;
  kubeId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useResetKubeConfig = ({
  projectId,
  kubeId,
  onError,
  onSuccess,
}: ResetKubeConfigProps) => {
  const mutation = useMutation({
    mutationFn: async () => resetKubeConfig(projectId, kubeId),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getKubernetesClusterQuery(projectId, kubeId),
      });
      onSuccess();
    },
  });
  return {
    resetKubeConfig: () => mutation.mutate(),
    ...mutation,
  };
};
type UpdateKubePolicyProps = {
  projectId: string;
  kubeId: string;
  updatePolicy: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useUpdateKubePolicy = ({
  projectId,
  kubeId,
  updatePolicy,
  onError,
  onSuccess,
}: UpdateKubePolicyProps) => {
  const mutation = useMutation({
    mutationFn: async () => updateKubePolicy(projectId, kubeId, updatePolicy),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getKubernetesClusterQuery(projectId, kubeId),
      });
      onSuccess();
    },
  });
  return {
    updateKubePolicy: () => mutation.mutate(),
    ...mutation,
  };
};

export const useKubeDetail = (
  projectId: string,
  kubeId: string,
  options?: Partial<UndefinedInitialDataOptions<TKube>>,
) => {
  const { t } = useTranslation('listing');

  const {
    data: kubeDetail,
    error: kubeError,
    isLoading: isKubeLoading,
    isPending: isKubePending,
  } = useKubernetesCluster(projectId, kubeId, options);

  const {
    data: privateNetworks,
    error: networksError,
    isLoading: isNetworksLoading,
    isPending: isNetworksPending,
  } = useAllPrivateNetworks(projectId);

  return useMemo(() => {
    const result = {
      ...kubeDetail,
      attachedTo: kubeDetail?.privateNetworkId
        ? getPrivateNetworkName(privateNetworks, kubeDetail.privateNetworkId)
        : t('kube_list_network_public'),
    };

    return {
      isLoading: isKubeLoading || isNetworksLoading,
      isPending: isKubePending || isNetworksPending,
      data: result,
      error: kubeError || networksError,
    };
  }, [
    kubeDetail,
    kubeError,
    isKubeLoading,
    isKubePending,
    privateNetworks,
    networksError,
    isNetworksLoading,
    isNetworksPending,
  ]);
};

export const getClusterRestrictionsQuery = (
  projectId: string,
  kubeId: string,
) => ['project', projectId, 'kube', kubeId, 'restrictions'];

export const useClusterRestrictions = (projectId: string, kubeId: string) =>
  useQuery({
    queryKey: getClusterRestrictionsQuery(projectId, kubeId),
    queryFn: () => getClusterRestrictions(projectId, kubeId),
  });

function getOidcProviderQuery(projectId: string, kubeId: string) {
  return ['project', projectId, 'kube', kubeId, 'openIdConnect'];
}

export const useOidcProvider = (projectId: string, kubeId: string) =>
  useQuery({
    queryKey: getOidcProviderQuery(projectId, kubeId),
    queryFn: () => getOidcProvider(projectId, kubeId),
  });

type KubeConfigProps = {
  projectId: string;
  kubeId: string;
  onError: (cause: Error) => void;
  onSuccess: (data: { content: string }) => void;
};

export const useKubeConfig = ({
  projectId,
  kubeId,
  onError,
  onSuccess,
}: KubeConfigProps) => {
  const mutation = useMutation({
    mutationFn: async () => postKubeConfig(projectId, kubeId),
    onError,
    onSuccess,
  });
  return {
    postKubeConfig: () => mutation.mutate(),
    ...mutation,
  };
};

type KubeUpdateVersionProps = {
  projectId: string;
  kubeId: string;
  strategy: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useUpdateKubeVersion = ({
  projectId,
  kubeId,
  strategy,
  onError,
  onSuccess,
}: KubeUpdateVersionProps) => {
  const mutation = useMutation({
    mutationFn: async () => updateKubeVersion(projectId, kubeId, strategy),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getKubernetesClusterQuery(projectId, kubeId),
      });
      onSuccess();
    },
  });
  return {
    updateKubeVersion: () => mutation.mutate(),
    ...mutation,
  };
};

type TerminateClusterProps = {
  projectId: string;
  kubeId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useTerminateCluster = ({
  projectId,
  kubeId,
  onError,
  onSuccess,
}: TerminateClusterProps) => {
  const mutation = useMutation({
    mutationFn: async () => terminateCluster(projectId, kubeId),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getKubernetesClusterQuery(projectId, kubeId),
      });
      await queryClient.invalidateQueries({
        queryKey: getAllKubeQueryKey(projectId),
      });
      onSuccess();
    },
  });
  return {
    terminateCluster: () => mutation.mutate(),
    ...mutation,
  };
};

type ResetClusterProps = {
  projectId: string;
  kubeId: string;
  params: TResetClusterParams;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useResetCluster = ({
  projectId,
  kubeId,
  params,
  onError,
  onSuccess,
}: ResetClusterProps) => {
  const mutation = useMutation({
    mutationFn: async () => resetCluster(projectId, kubeId, params),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['region-subnets', projectId],
      });
      await queryClient.invalidateQueries({
        queryKey: getKubernetesClusterQuery(projectId, kubeId),
      });
      await queryClient.invalidateQueries({
        queryKey: getAllKubeQueryKey(projectId),
      });
      onSuccess();
    },
  });
  return {
    resetCluster: () => mutation.mutate(),
    ...mutation,
  };
};

type UpsertOidcProviderProps = {
  projectId: string;
  kubeId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
  isUpdate: boolean;
};

export const useUpsertOidcProvider = ({
  projectId,
  kubeId,
  onError,
  onSuccess,
  isUpdate,
}: UpsertOidcProviderProps) => {
  const mutation = useMutation({
    mutationFn: async (params: TOidcProvider) =>
      isUpdate
        ? updateOidcProvider(projectId, kubeId, params)
        : addOidcProvider(projectId, kubeId, params),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getKubernetesClusterQuery(projectId, kubeId),
      });
      onSuccess();
    },
  });
  return {
    upsertOidcProvider: (params: TOidcProvider) => mutation.mutate(params),
    ...mutation,
  };
};

type RemoveOidcProviderProps = {
  projectId: string;
  kubeId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useRemoveOidcProvider = ({
  projectId,
  kubeId,
  onError,
  onSuccess,
}: RemoveOidcProviderProps) => {
  const mutation = useMutation({
    mutationFn: async () => removeOidcProvider(projectId, kubeId),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getKubernetesClusterQuery(projectId, kubeId),
      });
      onSuccess();
    },
  });
  return {
    removeOidcProvider: () => mutation.mutate(),
    ...mutation,
  };
};

export const getSubscribedLogsQueryKey = (
  projectId: string,
  kubeId: string,
  kind: string,
) => ['log-subscription', projectId, kubeId, 'audit', kind];

export const useSubscribedLogs = (
  projectId: string,
  kubeId: string,
  kind: string,
) =>
  useQuery({
    queryKey: getSubscribedLogsQueryKey(projectId, kubeId, kind),
    queryFn: () => getSubscribedLogs(projectId, kubeId, kind),
  });

export interface CreateSubscriptionProps {
  projectId: string;
  kubeId: string;
  streamId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export const useCreateSubscription = ({
  projectId,
  kubeId,
  streamId,
  onError,
  onSuccess,
}: CreateSubscriptionProps) => {
  const mutation = useMutation({
    mutationFn: async () => createSubscription(projectId, kubeId, streamId),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['dbaas-logs-subscriptions'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['dbaas-logs-streams'],
      });
      await queryClient.invalidateQueries({
        queryKey: getSubscribedLogsQueryKey(projectId, kubeId, 'audit'),
      });
      onSuccess();
    },
  });
  return {
    create: () => mutation.mutate(),
    ...mutation,
  };
};

export interface RemoveSubscriptionProps {
  projectId: string;
  kubeId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export const useRemoveSubscription = ({
  projectId,
  kubeId,
  onError,
  onSuccess,
}: RemoveSubscriptionProps) => {
  const mutation = useMutation({
    mutationFn: async (subscriptionId: string) =>
      deleteSubscription(projectId, kubeId, subscriptionId),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['dbaas-logs-subscriptions'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['dbaas-logs-streams'],
      });
      await queryClient.invalidateQueries({
        queryKey: getSubscribedLogsQueryKey(projectId, kubeId, 'audit'),
      });
      onSuccess();
    },
  });
  return {
    remove: (id: string) => mutation.mutate(id),
    ...mutation,
  };
};

export interface CreateClusterProps {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export const useCreateKubernetesCluster = ({
  projectId,
  onError,
  onSuccess,
}: CreateClusterProps) => {
  const mutation = useMutation({
    mutationFn: (params: KubeClusterCreationParams) =>
      createKubernetesCluster(projectId, params),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getAllKubeQueryKey(projectId),
      });
      onSuccess();
    },
  });
  return {
    createCluster: mutation.mutate,
    ...mutation,
  };
};

export const useGetClusterEtcdUsage = (projectId: string, kubeId: string) => {
  const queryKey = ['project', projectId, 'kube', kubeId, 'etcd', 'usage'];
  return useQuery({
    queryKey,
    queryFn: async () => {
      const data = await getKubeEtcdUsage(projectId, kubeId);
      return data;
    },
  });
};
