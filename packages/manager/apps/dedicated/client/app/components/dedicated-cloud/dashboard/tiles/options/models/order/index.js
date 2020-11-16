import preference from '../../../../../service-pack/upgrade/preference';

import optionsOrderService from './order.service';

const moduleName = 'ovhManagerPccDashboardOptionsOrder';

angular.module(moduleName, [optionsOrderService, preference]);

export default moduleName;
