import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-pagination-front';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-utils';

import routing from './user.routing';

const moduleName = 'ovhManagerPrivateDatabaseDatabaseUser';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngPaginationFront',
    'ui.router',
    'ngOvhUtils',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
