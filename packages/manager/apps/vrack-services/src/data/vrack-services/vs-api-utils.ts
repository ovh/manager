import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ApiResponse, ApiError } from '@ovh-ux/manager-core-api';
import { useTask } from '@ovh-ux/manager-react-components';
import {
  getVrackServicesResourceListQueryKey,
  getVrackServicesResource,
  getVrackServicesResourceQueryKey,
  ResourceStatus,
  VrackServices,
  UpdateVrackServicesParams,
  updateVrackServicesQueryKey,
  updateVrackServices,
  ProductStatus,
  VrackServicesWithIAM,
  getVrackServicesResourceList,
} from '@/data';

export const useVrackServicesList = (refetchIntervalTime = 5000) => {
  const queryClient = useQueryClient();

  return useQuery<ApiResponse<VrackServicesWithIAM[]>, ApiError>({
    queryKey: getVrackServicesResourceListQueryKey,
    queryFn: async () => {
      const result = await getVrackServicesResourceList();
      result?.data.forEach((vs) => {
        queryClient.setQueryData(getVrackServicesResourceQueryKey(vs.id), vs);
      });
      return result;
    },
    refetchInterval: (query) =>
      query.state.data?.data?.some((vs) =>
        vs?.currentTasks?.some((task) =>
          ['RUNNING', 'PENDING'].includes(task.status),
        ),
      )
        ? refetchIntervalTime
        : undefined,
  });
};

// Regular expression pattern for /24 subnet
export const pattern =
  '^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?).){2}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?).0/24$';

// The subnet address is limited to only "/24".
export const isValidCidr = (subnet: string): boolean => {
  return new RegExp(pattern).test(subnet);
};

/**
 * Query the current vRack Services and poll it if it is not ready
 */
export const useVrackService = (refetchIntervalTime = 2000) => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  return useQuery<
    VrackServicesWithIAM,
    ApiError,
    VrackServicesWithIAM,
    string[]
  >({
    queryKey: getVrackServicesResourceQueryKey(id),
    queryFn: async () => {
      const response = await getVrackServicesResource(id);
      queryClient.setQueryData(
        getVrackServicesResourceListQueryKey,
        ({ data: listingData, ...rest }: ApiResponse<VrackServices[]>) => ({
          data: listingData.map((vrackServices) =>
            vrackServices.id === response.data.id
              ? response.data
              : vrackServices,
          ),
          ...rest,
        }),
      );
      return response.data;
    },
    refetchInterval: (query) =>
      query.state.data?.currentTasks?.some((task) =>
        ['RUNNING', 'PENDING'].includes(task.status),
      )
        ? refetchIntervalTime
        : undefined,
  });
};

export const isEditable = (vs?: VrackServicesWithIAM) =>
  vs?.resourceStatus === ResourceStatus.READY &&
  [ProductStatus.ACTIVE, ProductStatus.DRAFT].includes(
    vs?.currentState.productStatus,
  );

export const hasSubnet = (vs?: VrackServicesWithIAM) =>
  vs?.currentState.subnets.length > 0;

export const getSubnetFromCidr = (vs?: VrackServicesWithIAM, cidr?: string) =>
  vs?.currentState?.subnets.find((s) => s.cidr === cidr);

export const getDisplayName = (vs?: VrackServicesWithIAM) =>
  vs?.iam?.displayName || vs?.id;

export const isValidVlanNumber = (vlan: number) => vlan >= 2 && vlan <= 4094;

/**
 * Get the function to mutate a vRack Services
 */
export const useUpdateVrackServices = ({
  id,
  onSuccess,
  onError,
}: {
  id: string;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const [taskId, setTaskId] = React.useState<string>();
  const queryClient = useQueryClient();

  const {
    isSuccess: isTaskSuccess,
    isPending: isTaskPending,
    isError: isTaskError,
    error: taskError,
  } = useTask({
    resourceUrl: `/vrackServices/resource/${id}`,
    apiVersion: 'v2',
    taskId,
    onSuccess,
    onError,
    onFinish: () => {
      setTaskId(undefined);
      queryClient.invalidateQueries({
        queryKey: getVrackServicesResourceListQueryKey,
      });
    },
  });

  const {
    mutate: updateVS,
    isPending,
    isError,
    error: updateError,
  } = useMutation<
    ApiResponse<VrackServices>,
    ApiError,
    UpdateVrackServicesParams
  >({
    mutationKey: updateVrackServicesQueryKey(id),
    mutationFn: updateVrackServices,
    onSuccess: (result: ApiResponse<VrackServices>) => {
      setTaskId(result?.data?.currentTasks[0].id);
      queryClient.invalidateQueries({
        queryKey: getVrackServicesResourceListQueryKey,
      });
    },
    onError,
  });

  return {
    updateVS,
    createSubnet: ({
      vs,
      displayName,
      cidr,
      serviceRange,
      vlan,
    }: {
      vs: VrackServicesWithIAM;
      displayName?: string;
      cidr: string;
      serviceRange: string;
      vlan?: number;
    }) =>
      updateVS({
        vrackServicesId: id,
        checksum: vs.checksum,
        targetSpec: {
          subnets: (vs.currentState.subnets || []).concat({
            displayName,
            cidr,
            serviceEndpoints: [],
            serviceRange: {
              cidr: serviceRange,
            },
            vlan,
          }),
        },
      }),
    updateSubnet: ({
      displayName,
      cidr,
      newCidr,
      serviceRange,
      vlan,
      vs,
    }: {
      displayName?: string;
      newCidr?: string;
      serviceRange?: string;
      vlan?: number;
      cidr: string;
      vs: VrackServicesWithIAM;
    }) =>
      updateVS({
        vrackServicesId: vs.id,
        checksum: vs.checksum,
        targetSpec: {
          subnets: vs.currentState.subnets.map((subnet) =>
            subnet.cidr === cidr
              ? {
                  ...subnet,
                  cidr: newCidr,
                  displayName,
                  serviceRange: {
                    cidr: serviceRange,
                  },
                  vlan,
                }
              : subnet,
          ),
        },
      }),
    deleteSubnet: ({
      vs,
      cidrToDelete,
    }: {
      vs: VrackServicesWithIAM;
      cidrToDelete: string;
    }) =>
      updateVS({
        vrackServicesId: vs.id,
        checksum: vs?.checksum,
        targetSpec: {
          subnets: vs?.currentState.subnets.filter(
            (subnet) => subnet.cidr !== cidrToDelete,
          ),
        },
      }),
    createEndpoint: ({
      vs,
      cidr,
      managedServiceURN,
    }: {
      vs: VrackServicesWithIAM;
      cidr: string;
      managedServiceURN: string;
    }) =>
      updateVS({
        vrackServicesId: id,
        checksum: vs.checksum,
        targetSpec: {
          displayName: vs.currentState.displayName,
          subnets: vs.currentState.subnets.map((subnet) =>
            subnet.cidr !== cidr
              ? subnet
              : {
                  ...subnet,
                  serviceEndpoints: (subnet.serviceEndpoints || []).concat({
                    managedServiceURN,
                  }),
                },
          ),
        },
      }),
    deleteEndpoint: ({
      vs,
      urnToDelete,
    }: {
      vs: VrackServicesWithIAM;
      urnToDelete: string;
    }) =>
      updateVS({
        vrackServicesId: vs?.id,
        checksum: vs?.checksum,
        targetSpec: {
          subnets: vs?.currentState.subnets.map((subnet) => ({
            ...subnet,
            serviceEndpoints: subnet.serviceEndpoints.filter(
              (endpoint) => endpoint.managedServiceURN !== urnToDelete,
            ),
          })),
        },
      }),
    isTaskSuccess,
    isPending: isPending || isTaskPending,
    isError: isError || isTaskError,
    updateError: updateError || taskError,
  };
};
