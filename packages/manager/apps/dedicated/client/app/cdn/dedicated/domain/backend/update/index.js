import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './cdn-dedicated-domain-backend-update.html';
import controller from './cdn-dedicated-domain-backend-update.controller';

const moduleName = 'cdnDedicatedDomainBackendUpdate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('CdnModifyBackendCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'domain/backend/update/cdn-dedicated-domain-backend-update.html',
        template,
      );
    },
  );

export default moduleName;
