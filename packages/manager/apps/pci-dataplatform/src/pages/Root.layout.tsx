import { useEffect } from 'react';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import { useRouting, useShell } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import PageLayout from '@/components/page-layout/PageLayout.component';

function RoutingSynchronisation() {
  const location = useLocation();
  const routing = useRouting();
  const shell = useShell();
  const matches = useMatches();

  useEffect(() => {
    routing.stopListenForHashChange();
  }, []);
  useEffect(() => {
    shell.ux.hidePreloader();
    routing.onHashChange();
  }, [location]);

  useEffect(() => {
    const match = matches.slice(-1);
    //  We cannot type properly useMatches cause it's not support type inference or passing specific type https://github.com/remix-run/react-router/discussions/10902
    defineCurrentPage(`app.pci-dataplatform.${match[0].id}`);
  }, [location]);

  return <></>;
}

export default function Layout() {
  return (
    <PageLayout>
      <RoutingSynchronisation />
      <Outlet />
    </PageLayout>
  );
}
