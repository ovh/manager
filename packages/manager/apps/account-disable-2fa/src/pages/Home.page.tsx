import React from 'react';
import { Outlet } from 'react-router-dom';
import ovhCloudLogo from '@/assets/logo-ovhcloud.png';

export default function Home() {
  return (
    <div className="sm:container mx-auto px-5">
      <div className="md:m-10 m-4">
        <div className="p-3 md:py-5">
          <div className="inline-block pb-3 md:pb-5">
            <img src={ovhCloudLogo} alt="ovh-cloud-logo" className="app-logo" />
          </div>
          <div className="flex justify-center app-content lg:w-8/12 mx-auto min-h-[500px] sm:shadow sm:shadow-[0_0_6px_0_rgba(40,89,192,0.2)] sm:border-none border-t-[1px] border-gray-300">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
