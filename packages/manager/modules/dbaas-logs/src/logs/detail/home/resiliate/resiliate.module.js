import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';

import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import routing from './resiliate.routing';

const moduleName = 'ovhManagerDbaasLogsDetailResiliate';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    ovhManagerBillingComponents,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
