import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ovhCloudLogo from '@/assets/logo-ovhcloud.png';
import { Status2faStrategies } from '@/types/status.type';
import { useFetch2faStatus } from '@/data/hooks/useStatus';
import { createRoutePath, seeRoutePath } from '@/routes/home.constants';

const redirectStrategies: Status2faStrategies = {
  open: `/${seeRoutePath}`,
  creationAuthorized: `/${createRoutePath}`,
};

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data, isFetched } = useFetch2faStatus();

  useEffect(() => {
    const route = redirectStrategies[data?.status];
    if (isFetched && route !== location.pathname) {
      navigate(route, { replace: true });
    }
  }, [isFetched, location]);

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
