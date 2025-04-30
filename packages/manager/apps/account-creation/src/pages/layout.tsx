import React, { useEffect, Suspense } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
} from '@ovh-ux/manager-react-shell-client';
import UserProvider from '@/context/user/user.provider';
import ReassuranceWording from '@/pages/ReassuranceWording.component';
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
        <div className="flex h-screen w-screen">
          <div className="flex flex-col app-content basis-7/12">
            <div className="p-0 pt-4 pl-6">
              <img
                src={ovhCloudLogo}
                alt="ovh-cloud-logo"
                className="app-logo"
              />
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <div className="max-w-lg">
                <Outlet />
              </div>
            </div>
          </div>
          <div className="hidden sm:flex justify-center sidebar basis-5/12 bg-gradient-to-br from-[#011B67] to-[#110BF5]">
            <img
              src={sideBackground}
              alt="reassuring wording background"
              className="sidebar-background-image"
            />
            <ReassuranceWording />
          </div>
        </div>
      </UserProvider>
    </Suspense>
  );
}
