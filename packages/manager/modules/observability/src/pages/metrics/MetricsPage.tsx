import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardProvider, MetricsOutletContext } from '../../contexts';

const MetricsPage = () => {
  const metricsContextValue: MetricsOutletContext = {
    obsMetrics: {
      id: 'obsMetricsid',
      iam: {
        id: 'obsMetricsidiamid',
        displayName: 'obsMetricsidiamdisplayname',
        urn: 'obsMetricsidiamdurn',
      },
      region: 'obsMetricsregion',
    },
  };

  return (
    <DashboardProvider
      context={{
        selectedTimeOption: '1h',
        refreshInterval: 15, // in seconds
      }}
    >
      <Outlet context={metricsContextValue} />
    </DashboardProvider>
  );
};
export default MetricsPage;
