import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import billing from '@ovh-ux/manager-billing';
import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerBillingAutorenewDelete';

angular
  .module(moduleName, [
    billing,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('billingAutorenewDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
