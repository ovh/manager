import angular from 'angular';
import '@uirouter/angularjs';

import component from './update-port.component';
import routing from './update-port.routing';

const moduleName = 'ovhManagerPciAppsAppDashboardAppUpdatePort';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'ovhManagerPciProjectAppsDashboardGeneralInformationUpdateAppPort',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
