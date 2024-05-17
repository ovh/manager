import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  dissociateVrackServices,
  dissociateVrackServicesQueryKey,
  getVrackTask,
  getVrackTaskQueryKey,
  associateVrackServices,
  associateVrackServicesQueryKey,
  getVrackServicesResourceListQueryKey,
  Task,
  VrackTask,
  getVrackServicesResourceQueryKey,
} from '@/api';

export const useAssociateAnotherVrack = ({
  vrackServices,
  currentVrack,
  onSuccess,
  onError,
}: {
  vrackServices: string;
  currentVrack: string;
  onSuccess?: () => void;
  onError?: (result: ApiError) => void;
}) => {
  const queryClient = useQueryClient();
  // State to manage vrack task
  const [taskInfo, setTaskInfo] = useState<{
    id: number;
    type: 'dissociation' | 'association';
    vrack: string;
  }>();
  // State to save new vrack to associate to
  const [vrackToAssociate, setVrackToAssociate] = useState<string>();
  // State to manage the loading on ui side
  const [loadingState, setLoadingState] = useState<{
    isLoading: boolean;
    state?: string;
  }>();
  // State to allow the association while dissociation is done
  const [associationReady, setAssociationReady] = useState<boolean>(false);

  /**
   *  MANAGE VRACK TAKS
   *  When a taskId is set, start a polling to retrieve the status of this task on vrack side
   *  When the task is done, we get a 404 error and the polling end.
   * */
  const { isError: isVrackTaskError, error: vrackTaskError } = useQuery({
    queryKey: getVrackTaskQueryKey({
      vrack: taskInfo?.vrack,
      taskId: taskInfo?.id,
    }),
    queryFn: async () => {
      const result = await getVrackTask({
        vrack: taskInfo.vrack,
        taskId: taskInfo.id,
      });
      setLoadingState({
        isLoading: true,
        state: (result.data as VrackTask).function,
      });
      return result;
    },
    retry: (failureCount, error: ApiError) => {
      if (failureCount < 2) return true;
      if (error?.response?.status === 404) {
        queryClient.invalidateQueries({
          queryKey: getVrackServicesResourceQueryKey(vrackServices),
        });
        switch (taskInfo.type) {
          case 'dissociation':
            // lauch association
            setAssociationReady(true);
            break;
          case 'association':
            // Inform UI that everything is done
            setLoadingState({ isLoading: false });
            onSuccess?.();
            break;
          default:
            return true;
        }
        setTaskInfo(null);
      } else {
        setLoadingState({ isLoading: false });
      }
      return false;
    },
    enabled: !!taskInfo,
    refetchInterval: (query) =>
      query.state.status !== 'error' ? 2000 : undefined,
  });

  /**
   *  DISSOCIATE CURRENT VRACK
   *  Before associate to new vRack we must dissociate from current one
   *  When API call for dissociation succeed, we start to check for the task by setting taskInfo
   * */
  const {
    mutate: startAssociateToAnotherVrack,
    error: dissociateError,
    isError: isDissociateError,
  } = useMutation({
    mutationFn: ({ newVrack }: { newVrack: string }) => {
      setVrackToAssociate(newVrack);
      setLoadingState({ isLoading: true });
      return dissociateVrackServices({
        vrack: currentVrack,
        vrackServices,
      });
    },
    mutationKey: dissociateVrackServicesQueryKey(currentVrack, vrackServices),
    onSuccess: async ({ data: { id } }) => {
      setTaskInfo({
        id: Number(id),
        type: 'dissociation',
        vrack: currentVrack,
      });
    },
    onError: (result: ApiError) => {
      setLoadingState({ isLoading: false });
      onError?.(result);
    },
  });

  /**
   *  ASSOCIATE TO NEW VRACK
   *  After dissociation task end, we try to associate to the new vrack
   *  When API call for dissociation succeed, we start to check for the task by setting taskInfo
   * */
  const {
    mutate: associateVs,
    isError: isErrorAssociation,
    error: associateError,
  } = useMutation<ApiResponse<Task>, ApiError>({
    mutationFn: () =>
      associateVrackServices({
        vrack: vrackToAssociate,
        vrackServices,
      }),
    mutationKey: associateVrackServicesQueryKey(vrackServices),
    onSuccess: ({ data: { id } }) => {
      setTaskInfo({
        id: Number(id),
        type: 'association',
        vrack: vrackToAssociate,
      });
    },
    onError: (result) => {
      setLoadingState({ isLoading: false });
      onError?.(result);
    },
  });

  // When Association is ready (After dissociation state end) launch association
  useEffect(() => {
    if (associationReady) {
      setAssociationReady(false);
      associateVs();
    }
  }, [associationReady]);

  return {
    startAssociateToAnotherVrack,
    isError: isDissociateError || isVrackTaskError || isErrorAssociation,
    error: (dissociateError || associateError || vrackTaskError) as ApiError,
    loadingState,
  };
};
