import React, { useEffect, useContext } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import { useRouting, ShellContext } from '@ovh-ux/manager-react-shell-client';

export default function Layout() {
  const location = useLocation();
  const routing = useRouting();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.pci-file-storage-${match[0]?.id}`);
  }, [location]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  useEffect(() => {
    routing.stopListenForHashChange();
  }, []);

  useEffect(() => {
    routing.onHashChange();
  }, [location]);

  return (
    <div className="m-10">
      <Outlet />
    </div>
  );
}
