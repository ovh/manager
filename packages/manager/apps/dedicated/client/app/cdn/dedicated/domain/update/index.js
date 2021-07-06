import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './cdn-dedicated-domain-domain.html';
import controller from './cdn-dedicated-domain-domain.controller';

const moduleName = 'cdnDedicatedDomainUpdate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('CdnUpdateDomainCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'domain/domain/cdn-dedicated-domain-domain.html',
        template,
      );
    },
  );

export default moduleName;
