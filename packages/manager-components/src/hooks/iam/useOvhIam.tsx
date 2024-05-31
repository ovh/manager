import { useState, useEffect } from 'react';
import { apiClient } from '@ovh-ux/manager-core-api';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { IamInterface } from './iam.interface';

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
  const [authorizedActions, setAuthorizedActions] = useState([]);
  const { data } = useQuery({
    queryKey: ['iam-authorization', urns, actions],
    queryFn: () => fetchAuthorizationsCheck({ actions, urns }),
    enabled: urns.length > 0 && actions.length > 0,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data) {
      setAuthorizedActions(data);
    }
  }, [data]);

  return authorizedActions;
}

export const fetchAuthorizationCheck = async (
  actions: string[],
  urn: string,
) => {
  const { data } = await apiClient.v2.post(
    `/iam/resource/${urn}/authorization/check`,
    {
      actions,
    },
  );
  return data;
};
export function useAuthorizationIam(
  actions: string[],
  urn: string,
  isTrigger = true,
  // `isTrigger` is by default at true, to request at the init of the hook.
  // In the case of action menu, we want to trigger it, when user click on button
) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { data, isLoading, isFetched } = useQuery({
    queryKey: [urn, actions],
    queryFn: () => fetchAuthorizationCheck(actions, urn),
    enabled:
      urn && urn.length > 0 && actions && actions.length > 0 && isTrigger,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data) {
      const { authorizedActions } = data;
      if (authorizedActions.length === actions.length) {
        setIsAuthorized(true);
      }
    }
  }, [data]);

  return { isAuthorized, isLoading, isFetched };
}
