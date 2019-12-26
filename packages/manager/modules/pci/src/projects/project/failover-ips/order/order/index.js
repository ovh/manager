import angular from 'angular';
import 'angular-translate';
import 'ovh-api-services';

import component from './order.component';

const moduleName = 'ovhManagerPciProjectFailoverIpsOrderOrder';

angular
  .module(moduleName, ['pascalprecht.translate', 'ovh-api-services'])
  .component('pciProjectFailoverIpsOrderOrder', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
