import React from 'react';
import { Outlet } from 'react-router-dom';
import { MetricsOutletContext } from '../../contexts';

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

  return <Outlet context={metricsContextValue} />;
};
export default MetricsPage;
