export const URL_PARAMS = {
  resourceName: ':resourceName?',
  dashboardWidget: ':widgetId',
};

export const subroutes = {
  resource: URL_PARAMS.resourceName,
  dashboardWidget: URL_PARAMS.dashboardWidget,
  metrics: 'metrics',
  subscriptionsConfig: `subscriptions/config`,
} as const;

export const urls = {
  root: '/',
  subscriptionsConfig: `/${subroutes.metrics}/${subroutes.subscriptionsConfig}/${URL_PARAMS.resourceName}`,
} as const;

export type LocationPathParams = {
  [K in keyof typeof URL_PARAMS]?: string;
};

export type UrlValue = (typeof urls)[keyof typeof urls];
