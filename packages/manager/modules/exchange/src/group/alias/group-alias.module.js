import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './group-alias.routing';
import aliasAddModule from './add/group-alias-add.module';
import aliasRemoveModule from './remove/group-alias-remove.module';

const moduleName = 'ovhManagerExchangeDashboardGroupAlias';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    aliasAddModule,
    aliasRemoveModule,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
