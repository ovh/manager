import React, { useEffect, Suspense } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
} from '@ovh-ux/manager-react-shell-client';
import UserProvider from '@/context/user/user.provider';
import ovhCloudLogo from '@/assets/logo-ovhcloud.png';
import sideBackground from '@/assets/side_background.svg';

export default function Layout() {
  const location = useLocation();
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.account-creation-${match[0]?.id}`);
  }, [location]);

  useEffect(() => {
    trackCurrentPage();
  }, [location]);

  return (
    <Suspense>
      <UserProvider>
        <div className="flex h-screen w-screen sm:container mx-auto">
          <div className="flex justify-center app-content lg:w-7/12 mx-auto min-h-[500px]">
            <div className="inline-block p-0 pt-4 pl-6">
              <img
                src={ovhCloudLogo}
                alt="ovh-cloud-logo"
                className="app-logo"
              />
            </div>
            <div className="md:p-8 w-full">
              <Outlet />
            </div>
          </div>
          <div className="flex justify-center sidebar lg:w-5/12 mx-auto min-h-[500px] bg-gradient-to-br from-[#011B67] to-[#110BF5]">
            <img
              src={sideBackground}
              alt="reassuring wording background"
              className="sidebar-background-image"
            />
            <div className="md:p-8 w-full">Blabla</div>
          </div>
        </div>
      </UserProvider>
    </Suspense>
  );
}
