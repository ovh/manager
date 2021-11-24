import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './cdn-dedicated-domain-delete.html';
import controller from './cdn-dedicated-domain-delete.controller';

const moduleName = 'cdnDedicatedDomainDelete';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('CdnDeleteDomainCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'cdn/dedicated/domain/delete/cdn-dedicated-domain-delete.html',
        template,
      );
    },
  );

export default moduleName;
