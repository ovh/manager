import angular from 'angular';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/manager-core';

import component from './order.component';

const moduleName = 'ovhManagerPciProjectFailoverIpsLegacyOrder';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ovh-api-services',
    'ovhManagerCore',
  ])
  .component('pciProjectFailoverIpsLegacyOrder', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
