import React from 'react';
import { Outlet } from 'react-router-dom';
import { ObsDashboard, ObsSpinner } from '../../../components';
import { useDashboardData } from '../../../hooks';

const DashboardDetailsPage: React.FC = () => {
  const { widgets, configLoading } = useDashboardData();

  if (configLoading) {
    return <ObsSpinner message="loading dashboard configuration" />;
  }

  return (
    <>
      <ObsDashboard widgets={widgets} />
      <Outlet />
    </>
  );
};

export default DashboardDetailsPage;
