import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './account-alias.routing';
import aliasAddModule from './add/account-alias-add.module';
import aliasRemoveModule from './remove/account-alias-remove.module';

const moduleName = 'ovhManagerExchangeDashboardAccountAlias';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    aliasAddModule,
    aliasRemoveModule,
  ])
  .config(routing);

export default moduleName;
