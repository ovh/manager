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
} from '@/types';
import queryClient from '@/queryClient';

export const getRegistryQueyPrefixWithId = (
  projectId: string,
  registryId: string,
  type: FilterRestrictionsServer[],
) => [...getRegistryQueryPrefix(projectId), registryId, 'ipRestrictions', type];

export const useIpRestrictions = (
  projectId: string,
  registryId: string,
  type: FilterRestrictionsServer[],
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
    }: {
      cidrToUpdate: Record<FilterRestrictionsServer, TIPRestrictionsDefault[]>;
      action: 'DELETE' | 'REPLACE';
    }) => updateIpRestriction(projectId, registryId, cidrToUpdate, action),
    onError,
    onSuccess: async () => {
      queryClient.invalidateQueries({
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
    }: {
      cidrToUpdate: Record<FilterRestrictionsServer, TIPRestrictionsDefault[]>;
      action: 'DELETE' | 'REPLACE';
    }) => mutation.mutate({ cidrToUpdate, action }),
    ...mutation,
  };
};
