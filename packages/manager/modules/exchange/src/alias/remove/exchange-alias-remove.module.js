import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import component from './exchange-alias-remove.component';

const moduleName = 'ovhManagerExchangeAliasRemove';

angular
  .module(moduleName, [ngTranslateAsyncLoader, 'oui', 'pascalprecht.translate'])
  .component('exchangeAliasRemove', component);

export default moduleName;
