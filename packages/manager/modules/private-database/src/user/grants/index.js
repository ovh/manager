import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-utils';

import '@ovh-ux/ng-pagination-front';
import routing from './grants.routing';

const moduleName = 'ovhManagerPrivateDatabaseUserGrants';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngPaginationFront',
    'oui',
    'ui.router',
    'ngOvhUtils',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
