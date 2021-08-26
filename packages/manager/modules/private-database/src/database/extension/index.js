import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import routing from './extension.routing';
import service from './private-database-database-extension.service';

const moduleName = 'ovhManagerPrivateDatabaseDatabaseExtension';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhUtils',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .service('PrivateDatabaseExtension', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
