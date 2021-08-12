import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './license-redirection-upgrade.html';
import controller from './license-redirection-upgrade.controller';

const moduleName = 'licenseRedirectionUpgrade';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('LicenseRedirectionUpgradeCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'redirection/upgrade/license-redirection-upgrade.html',
        template,
      );
    },
  );

export default moduleName;
