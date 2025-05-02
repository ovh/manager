import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiResponse, ApiError } from '@ovh-ux/manager-core-api';
import { useTask } from '@ovh-ux/manager-react-components';
import {
  UpdateVrackServicesParams,
  getVrackServicesResourceListQueryKey,
  updateVrackServices,
  updateVrackServicesQueryKey,
} from '../api';
import { VrackServices, VrackServicesWithIAM } from '../../types';

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
