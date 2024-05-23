import React from 'react';
import { Outlet } from 'react-router-dom';
import { useRouteSynchro } from '@ovh-ux/manager-react-shell-client';

export default function Layout() {
  useRouteSynchro();

  return (
    <div className="m-10">
      <Outlet />
    </div>
  );
}
