import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import component from './exchange-alias.component';
import aliasAddModule from './add/exchange-alias-add.module';
import aliasRemoveModule from './remove/exchange-alias-remove.module';

import './exchange-alias.styles.scss';

const moduleName = 'ovhManagerExchangeAlias';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    aliasAddModule,
    aliasRemoveModule,
  ])
  .component('exchangeAlias', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
