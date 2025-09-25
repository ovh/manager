import React, { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ObsFeatureType } from '../types/enums/ObsFeatureType';
import { getSafeDefaultFeature } from '../utils/ObsFeaturesUtils';
import { lazyWithPreload } from './lazyWithPreload';

// --- imports ---
const importMetricsPage = () => import('../pages/metrics/MetricsPage');

const importLogsPage = () => import('../pages/logs');

const importDashboardModule = () => import('../pages/metrics');

export const DashboardDetailsPage = lazyWithPreload(() =>
  importDashboardModule().then((m) => ({ default: m.DashboardDetailsPage })),
);

export const DashboardWidgetModal = lazyWithPreload(() =>
  importDashboardModule().then((m) => ({ default: m.DashboardWidgetModal })),
);

// preload immediately
DashboardDetailsPage.preload();
DashboardWidgetModal.preload();

// --- Helper for lazy routes with optional props ---
const lazyRouteConfig = (
  importFn: () => Promise<any>,
  exportName = 'default',
  props?: Record<string, any>,
) => {
  const LazyComponent = lazy(() =>
    importFn().then((m) => ({ default: m[exportName] })),
  );

  return {
    Component: (routeProps: any) =>
      props && Object.keys(props).length > 0 ? (
        <LazyComponent {...props} {...routeProps} />
      ) : (
        <LazyComponent {...routeProps} />
      ),
  };
};

/**
 * Observability routes generator
 */
export const getObservabilityRoute = (
  enabledFeatures: ObsFeatureType[],
  defaultFeature?: ObsFeatureType,
) => {
  const safeDefaultFeature = getSafeDefaultFeature(
    enabledFeatures,
    defaultFeature,
  );

  return (
    <>
      {/* Redirect root to safe default */}
      {safeDefaultFeature && (
        <Route index element={<Navigate to={safeDefaultFeature} replace />} />
      )}

      {/* Metrics route */}
      {enabledFeatures.includes(ObsFeatureType.Metrics) && (
        <Route
          path="metrics"
          id="metrics"
          {...lazyRouteConfig(importMetricsPage)}
        >
          <Route path={''} id="dashboard" Component={DashboardDetailsPage}>
            <Route
              path={`:widgetId`}
              id="dashboard-widget"
              Component={DashboardWidgetModal}
            />
          </Route>
        </Route>
      )}

      {/* Logs route */}
      {enabledFeatures.includes(ObsFeatureType.Logs) && (
        <Route path="logs" id="logs" {...lazyRouteConfig(importLogsPage)} />
      )}
    </>
  );
};
