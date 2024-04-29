import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ovhCloudLogo from '@/assets/logo-ovhcloud.png';
import { Status2faStrategies } from '@/interfaces';
import {
  createRoutePath,
  seeRoutePath,
} from '@/constants/route-path-constants';
import { get2faStatus } from '@/api';

const redirectStrategies: Status2faStrategies = {
  open: `/${seeRoutePath}`,
  creationAuthorized: `/${createRoutePath}`,
};

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data, isFetched } = useQuery({
    queryKey: ['get2faStatus'],
    queryFn: get2faStatus,
  });

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
