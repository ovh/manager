import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import ovhCloudLogo from '@/assets/logo-ovhcloud.png';
import { Status2faStrategies } from '@/types/status.type';
import { useFetch2faStatus } from '@/data/hooks/useStatus';
import { createRoutePath, seeRoutePath } from '@/routes/home.constants';

const redirectStrategies: Status2faStrategies = {
  open: `/account-disable-2fa/${seeRoutePath}`,
  creationAuthorized: `/account-disable-2fa/${createRoutePath}`,
};

const checkIfCreationIsAllowed = (error: AxiosError<any>) =>
  error?.response?.status === 404 &&
  error?.response?.data?.class === 'Client::ErrNotFound::ErrNotFound';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data, error, isSuccess, isFetched } = useFetch2faStatus();

  useEffect(() => {
    const route = redirectStrategies[data?.status];

    if (isSuccess && route !== location.pathname) {
      navigate(route, { replace: true });
    }
    if (checkIfCreationIsAllowed(error as AxiosError)) {
      navigate(redirectStrategies.creationAuthorized, { replace: true });
    }
  }, [isFetched]);

  return (
    <div className="sm:container mx-auto px-5">
      <div className="md:m-10 m-4">
        <div className="p-3 md:py-5">
          <div className="inline-block pb-3 md:pb-5">
            <img src={ovhCloudLogo} alt="ovh-cloud-logo" className="app-logo" />
          </div>
          <div className="flex justify-center app-content lg:w-8/12 mx-auto min-h-[500px] sm:shadow sm:shadow-[0_0_6px_0_rgba(40,89,192,0.2)] sm:border-none border-t-[1px] border-gray-300">
            {isFetched && <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
}
