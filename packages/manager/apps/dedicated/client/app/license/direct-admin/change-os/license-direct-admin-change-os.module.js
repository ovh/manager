import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './license-direct-admin-change-os.html';
import controller from './license-direct-admin-change-os.controller';

const moduleName = 'licenseDirectAdminChangeOs';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('LicenseDirectAdminChangeOsCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'direct-admin/change-os/license-direct-admin-change-os.html',
        template,
      );
    },
  );

export default moduleName;
