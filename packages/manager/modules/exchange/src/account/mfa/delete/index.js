import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './delete.component';

const moduleName = 'ExchangeAccountMfaDelete';

angular
  .module(moduleName, [ngTranslateAsyncLoader, 'oui', 'pascalprecht.translate'])
  .component('exchangeAccountMfaDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
