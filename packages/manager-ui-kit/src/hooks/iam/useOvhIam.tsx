import { useMemo } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { apiClient } from '@ovh-ux/manager-core-api';

import { formatIamTagsFromResources } from '@/commons/utils/TagsHelper';
import { useDataApi } from '@/hooks/data-api/ports/useDataApi';
import { IAMType, IamCheckResponse, IamObject } from '@/hooks/iam/IAM.type';

type IamAuthorizationCheckManyResponse = IamCheckResponse[];

export const fetchAuthorizationsCheck = async ({
  actions,
  urns,
}: {
  actions: string[];
  urns: string[];
}): Promise<IamAuthorizationCheckManyResponse> => {
  const response = await apiClient.v2.post<IamAuthorizationCheckManyResponse>(
    `/iam/authorization/check`,
    { actions, resourceURNs: urns },
  );
  return response.data;
};

export function useAuthorizationsIam({ actions, urns }: IAMType) {
  const { data } = useQuery<IamAuthorizationCheckManyResponse>({
    queryKey: ['iam-authorization', urns ?? [], actions ?? []],
    queryFn: () => fetchAuthorizationsCheck({ actions: actions ?? [], urns: urns ?? [] }),
    enabled: (urns?.length ?? 0) > 0 && (actions?.length ?? 0) > 0,
    placeholderData: keepPreviousData,
  });

  return data ?? [];
}

export function getAuthorizationCheckUrl(urn: string) {
  return `/iam/resource/${encodeURIComponent(urn)}/authorization/check`;
}

export const fetchAuthorizationCheck = async (
  actions: string[],
  urn: string,
): Promise<IamCheckResponse> => {
  const response = await apiClient.v2.post<IamCheckResponse>(getAuthorizationCheckUrl(urn), {
    actions,
  });
  return response.data;
};

export function useAuthorizationIam(actions: string[], urn: string, isTrigger = true) {
  const { data, ...query } = useQuery<IamCheckResponse>({
    queryKey: ['iam-authorization', urn, actions],
    queryFn: () => fetchAuthorizationCheck(actions, urn),
    enabled: Boolean(urn && urn.length > 0 && actions && actions.length > 0 && isTrigger),
    placeholderData: keepPreviousData,
  });

  return {
    isAuthorized:
      !!data?.authorizedActions &&
      actions.every((action) => data?.authorizedActions?.includes(action)),
    data,
    ...query,
  };
}

export function useGetResourceTags({
  resourceType,
  enabled = true,
}: {
  resourceType?: string;
  enabled?: boolean;
}) {
  let route = '/iam/resource';
  if (resourceType) {
    route = `${route}?resourceType=${resourceType}`;
  }

  const {
    flattenData: resources,
    isError: isTagsError,
    isLoading: isTagsLoading,
  } = useDataApi<IamObject>({
    version: 'v2',
    iceberg: true,
    route,
    cacheKey: ['iam/resource', resourceType || ''],
    enabled,
    fetchAll: true,
  });

  const tags = useMemo(() => {
    if (!resources) {
      return [];
    }
    return formatIamTagsFromResources(resources);
  }, [resources]);

  return {
    tags,
    isError: isTagsError,
    isLoading: isTagsLoading,
  };
}
