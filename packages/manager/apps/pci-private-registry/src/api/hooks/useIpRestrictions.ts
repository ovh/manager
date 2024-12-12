import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getRegistryQueryPrefix } from './useRegistry';
import {
  getIpRestrictions,
  updateIpRestriction,
} from '../data/ip-restrictions';
import {
  FilterRestrictionsServer,
  TIPRestrictionsData,
  TIPRestrictionsDefault,
  TIPRestrictionsMethodEnum,
} from '@/types';
import queryClient from '@/queryClient';

export type TUpdateIpRestrictionMutationParams = {
  cidrToUpdate: Record<FilterRestrictionsServer, TIPRestrictionsDefault[]>;
  action:
    | TIPRestrictionsMethodEnum.DELETE
    | TIPRestrictionsMethodEnum.REPLACE
    | TIPRestrictionsMethodEnum.ADD;
};

export const getRegistryQueyPrefixWithId = (
  projectId: string,
  registryId: string,
  type: FilterRestrictionsServer[] = ['management', 'registry'],
) => [...getRegistryQueryPrefix(projectId), registryId, 'ipRestrictions', type];

export const useIpRestrictions = (
  projectId: string,
  registryId: string,
  type: FilterRestrictionsServer[] = ['management', 'registry'],
  select?: (data: TIPRestrictionsData[]) => TIPRestrictionsData[],
) =>
  useSuspenseQuery<TIPRestrictionsData[]>({
    queryKey: getRegistryQueyPrefixWithId(projectId, registryId, type),
    queryFn: () => getIpRestrictions(projectId, registryId, type),
    select,
  });

type TUpdateIpRestrictionParams = {
  projectId: string;
  registryId: string;
  onError?: (error: unknown) => void;
  onSuccess?: () => void;
};

export const useUpdateIpRestriction = ({
  projectId,
  registryId,
  onError,
  onSuccess,
}: TUpdateIpRestrictionParams) => {
  const mutation = useMutation({
    mutationFn: async ({
      cidrToUpdate,
      action,
    }: TUpdateIpRestrictionMutationParams) =>
      updateIpRestriction(
        projectId,
        registryId,
        cidrToUpdate,
        action ?? TIPRestrictionsMethodEnum.ADD,
      ),
    onError,
    mutationKey: getRegistryQueyPrefixWithId(projectId, registryId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getRegistryQueyPrefixWithId(projectId, registryId, [
          'management',
          'registry',
        ]),
      });
      onSuccess?.();
    },
  });

  return {
    updateIpRestrictions: ({
      cidrToUpdate,
      action,
    }: TUpdateIpRestrictionMutationParams) =>
      mutation.mutate({ cidrToUpdate, action }),
    ...mutation,
  };
};
