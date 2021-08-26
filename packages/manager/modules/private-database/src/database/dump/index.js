import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import routing from './dump.routing';

import deleteController from './delete/private-database-database-dump-delete.controller';
import deleteTemplate from './delete/private-database-database-dump-delete.html';

const moduleName = 'ovhManagerPrivateDatabaseDatabaseDump';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhUtils',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .controller('PrivateDatabaseBDDsDumpsDeleteCtrl', deleteController)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'private-database/database/dump/delete/private-database-database-dump-delete.html',
        deleteTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
