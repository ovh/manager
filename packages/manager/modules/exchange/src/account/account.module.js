import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './account.routing';

import alias from './alias/alias.module';
import add from './add/add.module';

import component from './account.component';

const moduleName = 'ovhManagerExchangeDashboardAccount';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    alias,
    add,
  ])
  .config(routing)
  .component('exchangeAccountHome', component);

export default moduleName;
