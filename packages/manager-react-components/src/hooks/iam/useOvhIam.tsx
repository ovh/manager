import { apiClient, fetchIcebergV2 } from '@ovh-ux/manager-core-api';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { IamCheckResponse, IamInterface, IamObject } from './iam.interface';
import { formatIamTagsFromResources } from '../../utils/format-tags';

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

export const fetchResourceTags = async ({
  resourceType,
  primaryResourceUrn,
}: {
  resourceType?: string;
  primaryResourceUrn: string;
}) => {
  let url = '/iam/resource';

  if (!!resourceType) {
    url = `${url}?resourceType=${resourceType}`;
  }

  let { data: resources, cursorNext } = await fetchIcebergV2<IamObject>({
    route: url,
    pageSize: 5000,
  });

  while (!!cursorNext) {
    const { data, cursorNext: nextCursor } = await fetchIcebergV2<IamObject>({
      route: url,
      pageSize: 500,
      cursor: cursorNext,
    });
    resources = resources.concat(data);
    cursorNext = nextCursor;
  }

  return formatIamTagsFromResources(resources);
};

export function useGetResourceTags({
  resourceType,
  primaryResourceUrn,
  enabled,
}: {
  resourceType?: string;
  primaryResourceUrn?: string;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ['iam/resource', resourceType, primaryResourceUrn],
    queryFn: () => fetchResourceTags({ resourceType, primaryResourceUrn }),
    enabled,
  });
}
