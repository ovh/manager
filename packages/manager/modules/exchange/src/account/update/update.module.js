import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './update.routing';
import component from './account-update.component';

const moduleName = 'ovhManagerExchangeDashboardAccountUpdate';

angular
  .module(moduleName, [ngTranslateAsyncLoader, 'oui', 'pascalprecht.translate'])
  .config(routing)
  .component('exchangeAccountUpdate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
