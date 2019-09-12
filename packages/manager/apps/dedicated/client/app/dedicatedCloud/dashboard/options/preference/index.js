import {
  name as serviceName,
  OvhManagerPccDashboardOptionsPreference,
} from './preference.service';

const moduleName = 'ovhManagerPccDashboardOptionsPreference';

angular
  .module(moduleName, [])
  .service(serviceName, OvhManagerPccDashboardOptionsPreference);

export default moduleName;
