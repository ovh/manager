import { MODULE_NAME } from '@/MetricsToCustomer.constants';

export const NAMESPACE_PREFIX = `${MODULE_NAME}`;

export const NAMESPACES = {
  CHART: `${NAMESPACE_PREFIX}/chart`,
  DASHBOARDS: `${NAMESPACE_PREFIX}/dashboards`,
  TIME_CONTROLS: `${NAMESPACE_PREFIX}/timeControls`,
};
