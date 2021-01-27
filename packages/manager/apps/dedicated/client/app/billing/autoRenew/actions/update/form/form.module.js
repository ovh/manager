import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import component from './form.component';
import service from './form.service';

const moduleName = 'ovhManagerBillingAutorenewUpdateForm';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('billingAutorenewUpdateForm', component)
  .service('BillingAutorenewUpdateForm', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
