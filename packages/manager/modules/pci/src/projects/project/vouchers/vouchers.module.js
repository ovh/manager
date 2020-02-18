import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import add from './add';
import credit from './credit';

import component from './vouchers.component';
import routing from './vouchers.routing';
import service from './service';

const moduleName = 'ovhManagerPciProjectBillingVouchers';

angular
  .module(moduleName, [
    add,
    credit,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectVouchers', component)
  .service('CloudVouchersService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
