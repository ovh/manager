import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urls } from '@/routes/routes.constant';

interface UsePendingRedirectParams {
  isLoading: boolean;
  isAuthorized: boolean;
  condition?: boolean;
  redirectTo?: string;
}

/**
 * Custom hook to handle navigation logic for redirect.
 * Redirects to a specified route when user is not authorized or when required params are missing.
 * @param isLoading - If true, the hook will wait for the loading to be false.
 * @param isAuthorized - Whether the user is authorized.
 * @param condition - Redirect if the condition is false.
 * @param redirectTo - The route to redirect to.
 */
export const usePendingRedirect = ({
  isLoading,
  isAuthorized,
  condition = true,
  redirectTo = urls.root,
}: UsePendingRedirectParams) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthorized || !condition) {
      navigate(redirectTo);
    }
  }, [isAuthorized, condition, isLoading, navigate, redirectTo]);
};
