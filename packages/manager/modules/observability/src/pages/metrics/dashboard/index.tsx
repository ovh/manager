import React from 'react';
import { Outlet } from 'react-router-dom';
import { ObsDashboard, ObsSpinner } from '../../../components';
import { useDashboardData } from '../../../hooks';
import { useDashboard } from '../../../contexts';

const DashboardDetailsPage: React.FC = () => {
  const { state: dashboardState } = useDashboard();

  const { widgets, configLoading } = useDashboardData(dashboardState);

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
