import { useAuthorizationIam } from '@ovh-ux/manager-react-components';
import { useAccountUrn } from '@/data/hooks/useAccountUrn/useAccountUrn';

export const useAuthorization = (action: string[]) => {
  // useAuthorizationIam is disabled if urn is empty
  const { data: urn = '', isLoading: isLoadingUrn } = useAccountUrn();
  const {
    isAuthorized,
    isLoading: isLoadingAuthorization,
  } = useAuthorizationIam(action, urn);
  return { isAuthorized, isLoading: isLoadingUrn || isLoadingAuthorization };
};
