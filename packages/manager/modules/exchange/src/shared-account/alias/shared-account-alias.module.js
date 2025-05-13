import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './shared-account-alias.routing';
import aliasAddModule from './add/shared-account-alias-add.module';
import aliasRemoveModule from './remove/shared-account-alias-remove.module';

const moduleName = 'ovhManagerExchangeDashboardSharedAccountAlias';

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
