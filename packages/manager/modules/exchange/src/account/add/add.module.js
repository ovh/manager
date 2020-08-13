import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './add.routing';
import component from './account-add.component';

const moduleName = 'ovhManagerExchangeDashboardAccountAdd';

angular
  .module(moduleName, [ngTranslateAsyncLoader, 'oui', 'pascalprecht.translate'])
  .config(routing)
  .component('exchangeAccountAdd', component);

export default moduleName;
