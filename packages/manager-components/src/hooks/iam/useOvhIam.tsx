import { useState, useEffect } from 'react';
import { apiClient } from '@ovh-ux/manager-core-api';
import {
  useInfiniteQuery,
  useQuery,
  keepPreviousData,
} from '@tanstack/react-query';

export interface IamIterface {
  page?: string;
  urns?: string[];
  actions?: string[];
  isTrigger?: boolean;
  pageIndex?: number | string;
}
export const fetchAuthorizationsCheck = async ({ actions, urns }: any) => {
  const { data } = await apiClient.v2.post(`/iam/authorization/check`, {
    actions,
    resourceURNs: urns,
  });
  return data;
};

function reducePages(pages: any) {
  const mergedPages = pages.reduce((acc: any, page: any) => {
    if (acc[page.resourceURN]) {
      acc[page.resourceURN].authorizedActions = [
        ...new Set([
          ...acc[page.resourceURN].authorizedActions,
          ...page.authorizedActions,
        ]),
      ];
      acc[page.resourceURN].unauthorizedActions = [
        ...new Set([
          ...acc[page.resourceURN].unauthorizedActions,
          ...page.unauthorizedActions,
        ]),
      ];
    } else {
      acc[page.resourceURN] = {
        ...page,
        authorizedActions: [...new Set(page.authorizedActions)],
        unauthorizedActions: [...new Set(page.unauthorizedActions)],
      };
    }
    return acc;
  }, {});

  const uniquePages = Object.values(mergedPages);
  return uniquePages;
}
export function useInfiniteAuthorizationsIam({
  actions = [],
  urns = [],
  isTrigger = true,
  pageIndex = 0,
}: IamIterface) {
  const [authorizedActions, setAuthorizedActions] = useState({});
  const [previousPageIndices, setPreviousPageIndices] = useState([]);

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['iam-authorization-infinite'],
    queryFn: () => fetchAuthorizationsCheck({ actions, urns }),
    initialPageParam: pageIndex,
    enabled: urns.length > 0 && actions.length > 0 && isTrigger,
    getNextPageParam: () => pageIndex,
  });

  useEffect(() => {
    if (data) {
      const pagesFlatten = data?.pages.map((page) => page).flat();
      setAuthorizedActions(reducePages(pagesFlatten));
      setPreviousPageIndices(data?.pageParams);
    }
  }, [data]);

  return { authorizedActions, fetchNextPage, previousPageIndices };
}

export function useIsAuthorized(action: string, urn: string) {
  const { authorizedActions }: any = useInfiniteAuthorizationsIam({});

  let urnMapped = [];
  if (authorizedActions && Object.values(authorizedActions).length > 0) {
    urnMapped = authorizedActions?.map(
      (element: any) =>
        element.resourceURN === urn &&
        element.authorizedActions.indexOf(action) > -1,
    );
  }
  return urnMapped.indexOf(true) > -1;
}

export function useAuthorizationsIam({
  actions,
  urns,
  isTrigger = true,
}: IamIterface) {
  const [authorizedActions, setAuthorizedActions] = useState({});
  const { data } = useQuery({
    queryKey: ['iam-authorization', urns],
    queryFn: () => fetchAuthorizationsCheck({ actions, urns }),
    enabled: urns.length > 0 && actions.length > 0 && isTrigger,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data) {
      setAuthorizedActions(data);
    }
  }, [data]);

  return authorizedActions;
}
