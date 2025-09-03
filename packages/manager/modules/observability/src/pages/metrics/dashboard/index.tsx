import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardDetailsPage: React.FC = () => {
  return (
    <>
      <div className="flex flex-col gap-4">Metrics Page</div>
      <Outlet />
    </>
  );
};

export default DashboardDetailsPage;
