import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import routing from './routing';
import nodes from './nodes';
import generalInfo from './general-info';
import service from '../service';

const moduleName = 'ovhManagerNutanixDashboard';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    generalInfo,
    nodes,
  ])
  .config(routing)
  .service('Nutanix', service)
  .component('nutanixDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
