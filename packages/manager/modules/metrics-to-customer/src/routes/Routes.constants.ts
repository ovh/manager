export const URL_PARAMS = {
  resourceName: ':resourceName?',
  dashboardWidget: ':widgetId',
  subscriptionId: ':subscriptionId',
};

export const subroutes = {
  metrics: 'metrics',
  dashboardWidget: URL_PARAMS.dashboardWidget,
  subscriptionsConfig: `subscriptions/config`,
  subscription: 'subscription',
  create: 'create',
} as const;

export const urls = {
  base: '',
  subscriptionsConfig: `${subroutes.subscriptionsConfig}/${URL_PARAMS.resourceName}`,
  tenantCreateSubscription: `${subroutes.subscriptionsConfig}/${URL_PARAMS.resourceName}/create`,
} as const;

export type LocationPathParams = {
  [K in keyof typeof URL_PARAMS]?: string;
};

export type UrlValue = (typeof urls)[keyof typeof urls];
