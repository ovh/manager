import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useRouting } from '@ovh-ux/manager-react-shell-client';

function RoutingSynchronisation() {
  const location = useLocation();
  const routing = useRouting();
  useEffect(() => {
    routing.stopListenForHashChange();
  }, []);
  useEffect(() => {
    routing.onHashChange();
  }, [location]);
  return <></>;
}

export default function Layout() {
  return (
    <>
      <RoutingSynchronisation />
      <Outlet />
    </>
  );
}
