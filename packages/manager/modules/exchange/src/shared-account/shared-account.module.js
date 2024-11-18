import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './shared-account.routing';
import component from './shared-account.component';
import alias from './alias/shared-account-alias.module';

const moduleName = 'ovhManagerExchangeDashboardSharedAccount';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    alias,
  ])
  .component('exchangeSharedAccountHome', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
