import { useEffect, Suspense } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
} from '@ovh-ux/manager-react-shell-client';
import UserProvider from '@/context/user/user.provider';
import ReassuranceWording from '@/pages/ReassuranceWording.component';
import sideBackground from '@/assets/side_background.svg';
import Header from '@/components/header/Header.component';

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
        <div className="flex flex-row h-screen">
          <div className="w-full flex flex-col app-content md:basis-7/12 max-h-screen">
            {/* header component */}
            <Header />
            {/* app component */}
            <div className="flex-1 overflow-y-auto">
              <div className="min-h-full flex items-center justify-center">
                <div className="w-full p-6 sm:p-0 max-w-lg">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:flex justify-center sidebar basis-5/12 bg-gradient-to-br from-[#011B67] to-[#110BF5]">
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
