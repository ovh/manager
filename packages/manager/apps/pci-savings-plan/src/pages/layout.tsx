import {
  ShellContext,
  useOvhTracking,
  useRouteSynchro,
} from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { ErrorBanner, PageLayout } from '@ovh-ux/manager-react-components';
import { useProject } from '@ovh-ux/manager-pci-common';
import React, { Suspense, useContext, useEffect } from 'react';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Loading from '@/components/Loading/Loading';
import { useSavingsPlan } from '@/hooks/useSavingsPlan';

const Header = () => {
  return (
    <div className="flex flex-col my-5">
      <Suspense>
        <Breadcrumb />
      </Suspense>
    </div>
  );
};

export default function Layout() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.pci-savings-plan-${match[0]?.id}`);
  }, [location]);

  useEffect(() => {
    trackCurrentPage();
  }, [location]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  const { isLoading, isError, error } = useProject();
  const {
    isLoading: isLoadingSavingsPlan,
    isError: isErrorSavingsPlan,
  } = useSavingsPlan();

  if (isError || isErrorSavingsPlan || error) {
    return <ErrorBanner error={error?.response} />;
  }

  if (isLoading || isLoadingSavingsPlan) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    );
  }

  return (
    <PageLayout>
      <Header />
      <Outlet />
    </PageLayout>
  );
}
