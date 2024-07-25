import {
  ShellContext,
  useOvhTracking,
  useRouteSynchro,
} from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { PageLayout } from '@ovhcloud/manager-components';
import React, { Suspense, useContext, useEffect } from 'react';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Errors from '@/components/Error/Error';
import Loading from '@/components/Loading/Loading';
import { useSavingsPlan } from '@/hooks/useSavingsPlan';

const Header = () => {
  const { isLoading, isError, error } = useSavingsPlan();

  if (isError || error) {
    return <Errors error={error.message} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    );
  }
  return (
    <div className="flex flex-col my-5">
      <Suspense fallback={<Loading />}>
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

  /*
  Not Work on LABEU but we need to fetch this ..

  const { isLoading, data, isError, error } = useProject();


  if (isError || error) {
    return <ErrorBanner error={error.response} />;
  }

  if (isLoading || !data) {
    return <Loading />;
  } */
  return (
    <PageLayout>
      <Header />
      <Outlet />
    </PageLayout>
  );
}
