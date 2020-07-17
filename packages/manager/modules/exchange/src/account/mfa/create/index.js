import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './create.component';

const moduleName = 'ExchangeAccountMfaCreate';

angular
  .module(moduleName, [ngTranslateAsyncLoader, 'oui', 'pascalprecht.translate'])
  .component('exchangeAccountMfaCreate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
