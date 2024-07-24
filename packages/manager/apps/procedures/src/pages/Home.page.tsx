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
} from '@/routes/home.constants';
import { rootRoute } from '@/routes/routes';
import Loading from '@/components/Loading/Loading';
import { SkeletonLoading } from '@/components/Loading/SkeletonLoading';

const redirectStrategies: Record<Status2fa['status'] | 'error', string> = {
  open: `${rootRoute}/${seeRoutePath}`,
  creationAuthorized: `${rootRoute}/${createRoutePath}`,
  error: `${rootRoute}/${errorRoutePath}`,
};

const checkIfCreationIsAllowed = (error: AxiosError<any>) =>
  error?.response?.status === 404 &&
  error?.response?.data?.class === 'Client::ErrNotFound::ErrNotFound';

export default function Home() {
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
    <div className="sm:container mx-auto px-6">
      <div className="md:py-12 p-6">
        <div className="inline-block pb-6 md:pb-12">
          <img src={ovhCloudLogo} alt="ovh-cloud-logo" className="app-logo" />
        </div>
        <div className="flex justify-center app-content lg:w-8/12 mx-auto min-h-[500px] sm:shadow sm:shadow-[0_0_6px_0_rgba(40,89,192,0.2)] sm:border-none border-t-[1px] border-gray-300 px-6">
          <div className="md:p-8 w-full">
            {isLoading ? <SkeletonLoading /> : <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
}
