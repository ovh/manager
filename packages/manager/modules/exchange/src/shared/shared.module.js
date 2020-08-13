import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './shared.routing';

import permission from './permission/permission.module';

const moduleName = 'ovhManagerExchangeDashboardShared';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    permission,
  ])
  .config(routing);

export default moduleName;
