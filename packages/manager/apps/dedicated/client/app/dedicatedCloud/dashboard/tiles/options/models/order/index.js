import preference from '../../../../../service-pack/upgrade/preference';

import {
  name as serviceName,
  OptionsService,
} from './order.service';

const moduleName = 'ovhManagerPccDashboardOptionsOrder';

angular
  .module(moduleName, [
    preference,
  ])
  .service(serviceName, OptionsService);

export default moduleName;
