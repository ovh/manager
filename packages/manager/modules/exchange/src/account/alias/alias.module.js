import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './alias.routing';
import component from './account-alias.component';

import './account-alias.styles.scss';

const moduleName = 'ovhManagerExchangeDashboardAccountAlias';

angular
  .module(moduleName, [ngTranslateAsyncLoader, 'oui', 'pascalprecht.translate'])
  .config(routing)
  .component('exchangeAccountAlias', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
