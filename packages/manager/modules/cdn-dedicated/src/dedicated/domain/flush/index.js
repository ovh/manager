import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './cdn-dedicated-domain-flush.html';
import controller from './cdn-dedicated-domain-flush.controller';

const moduleName = 'cdnDedicatedDomainFlush';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('CdnFlushDomainsCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'cdn/dedicated/domain/flush/cdn-dedicated-domain-flush.html',
        template,
      );
    },
  );

export default moduleName;
