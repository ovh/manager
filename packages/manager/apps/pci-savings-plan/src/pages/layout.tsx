import React, { useEffect, useContext, Suspense } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import {
  Navigate,
  Outlet,
  useLocation,
  useMatches,
  useParams,
} from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import Loading from '@/components/Loading/Loading';
import { useSavingsPlan } from '@/hooks/useSavingsPlan';
import Errors from '@/components/Error/Error';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { PageLayout } from '@ovhcloud/manager-components';

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

  const { projectId } = useParams();
  const { data: services, isLoading, isError, error } = useSavingsPlan();

  if (isError || error) {
    return <Errors error={error.message} />;
  }

  if (isLoading || !services) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    );
  }

  if (services.length === 0) {
    return <Navigate to={`/pci/project/${projectId}/onboarding`} />;
  }

  return (
    <PageLayout>
      <div className="flex flex-col my-5">
        <Suspense fallback={<Loading />}>
          <Breadcrumb />
        </Suspense>
      </div>
      <Outlet />
    </PageLayout>
  );
}
