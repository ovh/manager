import angular from 'angular';
import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import uiRouter from '@uirouter/angularjs';

import routing from './cancel-resiliation.routing';

const moduleName = 'ovhManagerBillingAutorenewCancelResiliation';

angular
  .module(moduleName, [ovhManagerBillingComponents, uiRouter])
  .config(routing);

export default moduleName;
