import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import { serverTechnicalDetails } from '@ovh-ux/manager-bm-server-components';
import component from './component';
import routing from './routing';
import nodes from './nodes';
import generalInfo from './general-info';

import service from './service';

const moduleName = 'ovhManagerNutanixDashboard';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    generalInfo,
    nodes,
    serverTechnicalDetails,
  ])
  .config(routing)
  .component('nutanixDashboard', component)
  .service('NutanixService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
