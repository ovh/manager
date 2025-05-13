import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import component from './exchange-alias-add.component';

const moduleName = 'ovhManagerExchangeAliasAdd';

angular
  .module(moduleName, [ngTranslateAsyncLoader, 'oui', 'pascalprecht.translate'])
  .component('exchangeAliasAdd', component);

export default moduleName;
