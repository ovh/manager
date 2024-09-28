import { useContext } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ManagerReactComponentContext } from '../../context/ManagerReactComponentsContext';
import { IamCheckResponse, IamInterface } from './iam.interface';

export const fetchAuthorizationsCheck = async ({
  actions,
  urns,
}: {
  actions: string[];
  urns: string[];
}) => {
  const context = useContext(ManagerReactComponentContext);
  const { apiClient } = context;
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

export const fetchAuthorizationCheck = async (
  actions: string[],
  urn: string,
): Promise<IamCheckResponse> => {
  const context = useContext(ManagerReactComponentContext);
  const { apiClient } = context;
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
  const { data, ...query } = useQuery({
    queryKey: [urn, actions],
    queryFn: () => fetchAuthorizationCheck(actions, urn),
    enabled:
      urn && urn.length > 0 && actions && actions.length > 0 && isTrigger,
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
