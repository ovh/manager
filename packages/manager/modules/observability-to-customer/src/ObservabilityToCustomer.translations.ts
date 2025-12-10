import { MODULE_NAME } from "@/ObservabilityToCustomer.constants";

export const NAMESPACE_PREFIX = `@ovh-ux/${MODULE_NAME}`;

export const NAMESPACES = {
  CHART: `${NAMESPACE_PREFIX}/chart`,
  DASHBOARDS: `${NAMESPACE_PREFIX}/dashboards`,
  TIME_CONTROLS: `${NAMESPACE_PREFIX}/timeControls`,
};
