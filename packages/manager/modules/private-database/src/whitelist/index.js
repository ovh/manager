import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-utils';

import routing from './allowed-ips.routing';

import service from './private-database-whiteliste.service';

import addController from './add/private-database-whitelist-add.controller';
import addTemplate from './add/private-database-whitelist-add.html';
import deleteController from './delete/private-database-whitelist-delete.controller';
import deleteTemplate from './delete/private-database-whitelist-delete.html';
import updateController from './update/private-database-whitelist-update.controller';
import updateTemplate from './update/private-database-whitelist-update.html';

const moduleName = 'ovhManagerPrivateDatabaseAllowedIPs';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhWebUniverseComponents',
    'oui',
    'ui.router',
    'ngOvhUtils',
  ])
  .config(routing)
  .service('PrivateDatabaseWhitelistService', service)
  .controller('PrivateDatabaseAddWhitelistCtrl', addController)
  .controller('PrivateDatabaseDeleteWhitelistCtrl', deleteController)
  .controller('PrivateDatabaseUpdateWhitelistCtrl', updateController)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'private-database/whitelist/add/private-database-whitelist-add.html',
        addTemplate,
      );
      $templateCache.put(
        'private-database/whitelist/delete/private-database-whitelist-delete.html',
        deleteTemplate,
      );
      $templateCache.put(
        'private-database/whitelist/update/private-database-whitelist-update.html',
        updateTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
