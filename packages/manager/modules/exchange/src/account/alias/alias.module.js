import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './alias.routing';
import component from './account-alias.component';

const moduleName = 'ovhManagerExchangeDashboardAccountAlias';

angular
  .module(moduleName, [ngTranslateAsyncLoader, 'oui', 'pascalprecht.translate'])
  .config(routing)
  .component('exchangeAccountAlias', component);

export default moduleName;
