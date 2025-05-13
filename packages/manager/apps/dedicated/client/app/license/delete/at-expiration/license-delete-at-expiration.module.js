import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './license-delete-at-expiration.html';
import controller from './license-delete-at-expiration.controller';

const moduleName = 'licenseDeleteAtExpiration';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('Module.license.deleteAtExpirationCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'delete/at-expiration/license-delete-at-expiration.html',
        template,
      );
    },
  );

export default moduleName;
