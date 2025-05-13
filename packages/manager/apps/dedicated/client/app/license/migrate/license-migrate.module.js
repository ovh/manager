import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './license-migrate.html';
import controller from './license-migrate.controller';

const moduleName = 'licenseMigrate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('LicenseMigrateCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('migrate/license-migrate.html', template);
    },
  );

export default moduleName;
