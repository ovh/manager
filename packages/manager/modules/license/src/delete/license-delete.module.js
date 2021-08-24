import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './license-delete.html';
import controller from './license-delete.controller';

const moduleName = 'licenseDelete';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('LicenseDeleteCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('license/delete/license-delete.html', template);
    },
  );

export default moduleName;
