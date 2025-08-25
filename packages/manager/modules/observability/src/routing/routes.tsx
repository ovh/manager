import React, { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ObsFeatureType } from '../types/enums/ObsFeatureType';
import { getSafeDefaultFeature } from '../utils/ObsFeaturesUtils';

// --- imports ---
const importMetricsPage = () => import('../pages/metrics');
const importDashboardDetailsPage = () => import('../pages/metrics/dashboard');
const importDashboardWidgetModal = () =>
  import('../pages/metrics/dashboardWidget');
const importLogsPage = () => import('../pages/logs');

// --- Helper for lazy routes with optional props ---
const lazyRouteConfig = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  props?: Record<string, any>,
) => {
  const LazyComponent = lazy(importFn);

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
          <Route
            path={''}
            id="dashboard"
            {...lazyRouteConfig(importDashboardDetailsPage)}
          >
            <Route
              path={`:widgetId`}
              id="dashboard-widget"
              {...lazyRouteConfig(importDashboardWidgetModal)}
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
