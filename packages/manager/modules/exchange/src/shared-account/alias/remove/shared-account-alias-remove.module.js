import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './shared-account-alias-remove.routing';

const moduleName = 'ovhManagerExchangeDashboardSharedAccountAliasRemove';

angular
  .module(moduleName, [ngTranslateAsyncLoader, 'oui', 'pascalprecht.translate'])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
