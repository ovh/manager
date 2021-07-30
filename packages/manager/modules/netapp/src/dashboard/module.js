import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-utils';

import '@ovh-ux/manager-advices';
import '@ovh-ux/manager-billing-components';
import component from './component';
import routing from './routing';

import volumes from './volumes';

const moduleName = 'ovhManagerNetAppDashboard';

angular
  .module(moduleName, [
    'ovhManagerBilling',
    'ovhManagerCore',
    'ovhManagerAdvices',
    'pascalprecht.translate',
    'ui.router',
    'ngOvhUtils',
    volumes,
  ])
  .config(routing)
  .component('ovhManagerNetAppDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
