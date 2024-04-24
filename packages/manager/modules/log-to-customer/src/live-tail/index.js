import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-log-live-tail';
import '@uirouter/angularjs';

import component from './component';
import service from '../service';

const moduleName = 'ovhLogToCustomerLiveTail';

angular
  .module(moduleName, ['pascalprecht.translate', 'ui.router', 'ngLogLiveTail'])
  .service('LogToCustomerService', service)
  .component('logToCustomerLiveTail', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
