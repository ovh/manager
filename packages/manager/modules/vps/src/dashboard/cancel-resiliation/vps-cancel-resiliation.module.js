import angular from 'angular';
import '@uirouter/angularjs';
import ovhManagerBilling from '@ovh-ux/manager-billing';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import 'ovh-api-services';

import routing from './vps-cancel-resiliation.routing';

const moduleName = 'ovhManagerVpsCancelResiliation';

angular
  .module(moduleName, [
    'ui.router',
    'ovh-api-services',
    ovhManagerBilling,
    ngAtInternet,
  ])
  .config(routing);

export default moduleName;
