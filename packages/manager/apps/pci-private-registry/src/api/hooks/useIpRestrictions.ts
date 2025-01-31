import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
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
import { compareFunction, paginateResults } from '@/helpers';

export type TUpdateIpRestrictionMutationParams = {
  cidrToUpdate: Record<FilterRestrictionsServer, TIPRestrictionsDefault[]>;
  action: TIPRestrictionsMethodEnum;
};

export const getRegistryQueyPrefixWithId = (
  projectId: string,
  registryId: string,
  type: FilterRestrictionsServer[] = ['management', 'registry'],
) => [...getRegistryQueryPrefix(projectId), registryId, 'ipRestrictions', type];

export const useIpRestrictions = <T = TIPRestrictionsData[]>(
  projectId: string,
  registryId: string,
  type: FilterRestrictionsServer[] = ['management', 'registry'],
  select?: (data: TIPRestrictionsDefault[]) => T,
) =>
  useSuspenseQuery({
    queryKey: getRegistryQueyPrefixWithId(projectId, registryId, type),
    queryFn: async (): Promise<TIPRestrictionsDefault[]> =>
      getIpRestrictions(projectId, registryId, type),
    select,
  });

export const sortIpRestrictions = (
  cidrs: TIPRestrictionsData[],
  sorting: ColumnSort,
): TIPRestrictionsData[] => {
  const data = [...cidrs];

  if (sorting) {
    const { id: sortKey, desc } = sorting;

    data.sort(
      compareFunction<TIPRestrictionsData>(
        sortKey as keyof TIPRestrictionsData,
      ),
    );
    if (desc) {
      data.reverse();
    }
  }

  return data;
};

export const useIpRestrictionsWithFilter = (
  projectId: string,
  registryId: string,
  type: FilterRestrictionsServer[],
  pagination: PaginationState,
  filters: Filter[],
  sorting: ColumnSort,
) =>
  useIpRestrictions(projectId, registryId, type, (data) =>
    paginateResults<TIPRestrictionsData>(
      applyFilters(
        sortIpRestrictions(
          data.map((restriction) => ({
            ...restriction,
            draft: false,
            checked: false,
            id: restriction.ipBlock,
          })) || [],
          sorting,
        ),
        filters,
      ),
      pagination,
    ),
  );

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
