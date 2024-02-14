import React from 'react';
import { Outlet } from 'react-router-dom';

function ServiceName() {
  return 'serviceName';
}

export function breadcrumb() {
  return <ServiceName />;
}

export default function ServiceLayout() {
  return (
    <>
      <p>Service</p>
      <ServiceName />
      <Outlet />
    </>
  );
}
