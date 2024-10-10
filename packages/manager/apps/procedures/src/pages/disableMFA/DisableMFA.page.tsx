import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import ovhCloudLogo from '@/assets/logo-ovhcloud.png';
import { Status2fa } from '@/types/status.type';
import { useFetch2faStatus } from '@/data/hooks/useStatus';
import {
  createRoutePath,
  seeRoutePath,
  errorRoutePath,
} from '@/routes/mfa.constants';
import { accountDisable2faRoute } from '@/routes/routes';
import { SkeletonLoading } from '@/components/Loading/SkeletonLoading';
import { SessionModals } from '@/context/User/modals/SessionModals';
import { PageLayout } from '@/components/PageLayout/PageLayout.component';

const redirectStrategies: Record<Status2fa['status'] | 'error', string> = {
  open: `${accountDisable2faRoute}/${seeRoutePath}`,
  creationAuthorized: `${accountDisable2faRoute}/${createRoutePath}`,
  error: `${accountDisable2faRoute}/${errorRoutePath}`,
};

const checkIfCreationIsAllowed = (error: AxiosError<any>) =>
  error?.response?.status === 404 &&
  error?.response?.data?.class === 'Client::ErrNotFound::ErrNotFound';

export default function DisableMFA() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (url: string): void => {
    if (location.pathname !== url) {
      // To avoid redirecting user to the login page after navigating to another view,
      // we append the location.search value to keep the token in the url
      // This could be handled by storing the token and removing it from the url (but it will to be done later)
      navigate(`${url}${location.search || ''}`, { replace: true });
    }
  };
  const { data, error, isSuccess, isFetched, isLoading } = useFetch2faStatus();
  const route = redirectStrategies[data?.status];
  useEffect(() => {
    if (isFetched) {
      if (isSuccess) {
        navigateTo(route);
      } else if (checkIfCreationIsAllowed(error as AxiosError)) {
        navigateTo(redirectStrategies.creationAuthorized);
      } else {
        navigateTo(redirectStrategies.error);
      }
    }
  }, [isFetched]);

  return (
    <>
      <PageLayout>{isLoading ? <SkeletonLoading /> : <Outlet />}</PageLayout>
      <SessionModals />
    </>
  );
}
