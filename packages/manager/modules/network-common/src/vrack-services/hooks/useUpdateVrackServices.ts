import React from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useTask } from '@ovh-ux/manager-react-components';

import { Subnet, VrackServices, VrackServicesWithIAM } from '../../types';
import {
  UpdateVrackServicesParams,
  getVrackServicesResourceListQueryKey,
  updateVrackServices,
  updateVrackServicesQueryKey,
} from '../api';

type UseTaskResult = {
  isSuccess: boolean;
  isPending: boolean;
  isError: boolean;
  error: ApiError | null;
};

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
      void queryClient.invalidateQueries({
        queryKey: getVrackServicesResourceListQueryKey,
      });
    },
  }) as UseTaskResult;

  const {
    mutate: updateVS,
    isPending,
    isError,
    error: updateError,
  } = useMutation<ApiResponse<VrackServices>, ApiError, UpdateVrackServicesParams>({
    mutationKey: updateVrackServicesQueryKey(id),
    mutationFn: updateVrackServices,
    onSuccess: (result: ApiResponse<VrackServices>) => {
      setTaskId(result?.data?.currentTasks?.[0]?.id);
      void queryClient.invalidateQueries({
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
          subnets: vs.currentState.subnets.concat({
            cidr,
            displayName: displayName ?? '',
            serviceEndpoints: [],
            serviceRange: { cidr: serviceRange },
            vlan: vlan ?? null,
          } satisfies Subnet),
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
                  cidr: newCidr ?? subnet.cidr, // fallback to existing cidr
                  displayName: displayName ?? subnet.displayName,
                  serviceRange: {
                    cidr: serviceRange ?? subnet.serviceRange.cidr,
                  },
                  vlan: vlan ?? subnet.vlan ?? null,
                }
              : subnet,
          ),
        },
      }),
    deleteSubnet: ({ vs, cidrToDelete }: { vs: VrackServicesWithIAM; cidrToDelete: string }) =>
      updateVS({
        vrackServicesId: vs.id,
        checksum: vs?.checksum,
        targetSpec: {
          subnets: vs?.currentState.subnets.filter((subnet) => subnet.cidr !== cidrToDelete),
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
    deleteEndpoint: ({ vs, urnToDelete }: { vs: VrackServicesWithIAM; urnToDelete: string }) =>
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
    isTaskSuccess: Boolean(isTaskSuccess),
    isPending: Boolean(isPending) || Boolean(isTaskPending),
    isError: Boolean(isError) || Boolean(isTaskError),
    updateError: updateError ?? taskError ?? null,
  };
};
