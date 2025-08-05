import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';

import component from './component';
import routing from './routing';
import nodes from './nodes';
import generalInfo from './general-info';

const moduleName = 'ovhManagerNutanixDashboard';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    generalInfo,
    nodes,
    ovhManagerBillingComponents,
  ])
  .config(routing)
  .component('nutanixDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
