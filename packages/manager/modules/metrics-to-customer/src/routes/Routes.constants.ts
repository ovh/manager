export const URL_PARAMS = {
  resourceName: ':resourceName?',
  dashboardWidget: ':widgetId',
  subscriptionId: ':subscriptionId',
};

export const subroutes = {
  metrics: 'metrics',
  logs: 'logs',
  dashboardWidget: URL_PARAMS.dashboardWidget,
  subscriptionsConfig: `subscriptions/config`,
  subscription: 'subscription',
  create: 'create',
} as const;

export const urls = {
  root: '',
  subscriptionsConfig: `${subroutes.subscriptionsConfig}/${URL_PARAMS.resourceName}`,
  tenantCreation: `${subroutes.subscriptionsConfig}/${URL_PARAMS.resourceName}/create`,
  logs: `${subroutes.logs}`,
} as const;

export type LocationPathParams = {
  [K in keyof typeof URL_PARAMS]?: string;
};

export type UrlValue = (typeof urls)[keyof typeof urls];
