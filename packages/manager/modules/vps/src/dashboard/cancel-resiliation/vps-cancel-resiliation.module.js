import angular from 'angular';
import '@uirouter/angularjs';
import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import 'ovh-api-services';

import routing from './vps-cancel-resiliation.routing';

const moduleName = 'ovhManagerVpsCancelResiliation';

angular
  .module(moduleName, [
    'ui.router',
    'ovh-api-services',
    ovhManagerBillingComponents,
    ngAtInternet,
  ])
  .config(routing);

export default moduleName;
