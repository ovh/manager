import { MODULE_NAME } from '@/MetricsToCustomer.constants';

export const NAMESPACE_PREFIX = `${MODULE_NAME}`;

export const NAMESPACES = {
  MODULE: `${NAMESPACE_PREFIX}/module`,
  CHART: `${NAMESPACE_PREFIX}/chart`,
  DASHBOARDS: `${NAMESPACE_PREFIX}/dashboards`,
  TIME_CONTROLS: `${NAMESPACE_PREFIX}/timeControls`,
  SUBSCRIPTIONS: `${NAMESPACE_PREFIX}/subscriptions`,
};
