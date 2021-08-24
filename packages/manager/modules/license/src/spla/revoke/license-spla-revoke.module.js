import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './license-spla-revoke.html';
import controller from './license-spla-revoke.controller';

const moduleName = 'licenseSplaRevoke';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('LicenseSplaRevokeCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'license/spla/revoke/license-spla-revoke.html',
        template,
      );
    },
  );

export default moduleName;
