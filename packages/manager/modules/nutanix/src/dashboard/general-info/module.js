import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerNutanixGeneralInfo';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    ovhManagerBillingComponents,
  ])
  .config(routing)
  .component('nutanixGeneralInfo', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
