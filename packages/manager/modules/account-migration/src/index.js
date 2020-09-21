import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import accountMigrationNotification from './notification';
import accountMigrationService from './service';

const moduleName = 'ovhManagerAccountMigration';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    accountMigrationNotification,
  ])
  .service('accountMigrationService', accountMigrationService);

export default moduleName;
