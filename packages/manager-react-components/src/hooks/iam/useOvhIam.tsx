import React, { useMemo } from 'react';
import { apiClient } from '@ovh-ux/manager-core-api';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { IamCheckResponse, IamInterface, IamObject } from './iam.interface';
import { formatIamTagsFromResources } from '../../utils/format-tags';
import { useResourcesIcebergV2 } from '..';

export const fetchAuthorizationsCheck = async ({
  actions,
  urns,
}: {
  actions: string[];
  urns: string[];
}) => {
  const { data } = await apiClient.v2.post(`/iam/authorization/check`, {
    actions,
    resourceURNs: urns,
  });
  return data;
};

export function useAuthorizationsIam({ actions, urns }: IamInterface) {
  const { data } = useQuery({
    queryKey: ['iam-authorization', urns, actions],
    queryFn: () => fetchAuthorizationsCheck({ actions, urns }),
    enabled: urns.length > 0 && actions.length > 0,
    placeholderData: keepPreviousData,
  });

  return data || [];
}

export function getAuthorizationCheckUrl(urn: string) {
  return `/iam/resource/${encodeURIComponent(urn)}/authorization/check`;
}

export const fetchAuthorizationCheck = async (
  actions: string[],
  urn: string,
): Promise<IamCheckResponse> => {
  const { data } = await apiClient.v2.post(getAuthorizationCheckUrl(urn), {
    actions,
  });
  return data;
};
export function useAuthorizationIam(
  actions: string[],
  urn: string,
  isTrigger = true,
  // `isTrigger` is by default at true, to request at the init of the hook.
  // In the case of action menu, we want to trigger it, when user click on button
) {
  const { data, ...query } = useQuery({
    queryKey: [urn, actions],
    queryFn: () => fetchAuthorizationCheck(actions, urn),
    enabled: Boolean(
      urn && urn.length > 0 && actions && actions.length > 0 && isTrigger,
    ),
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
  } = useResourcesIcebergV2<IamObject>({
    route,
    queryKey: ['iam/resource', resourceType],
    enabled,
    shouldFetchAll: true,
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
