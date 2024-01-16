import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useRouting } from '@ovh-ux/manager-react-shell-client';

function RoutingSynchronisation() {
  const location = useLocation();
  // const navigate = useNavigate();
  // const matches: any = matchRoutes(routes, { pathname: location.pathname });

  const routing = useRouting();
  useEffect(() => {
    routing.stopListenForHashChange();
  }, []);
  useEffect(() => {
    routing.onHashChange();
    // if (matches && matches[matches.length - 1].route?.element === undefined) {
    //   navigate('/');
    // }
    console.info('entre dans le useEffect Layout.tsx location : ', location);
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
