import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './cdn-dedicated-domain-add.html';
import controller from './cdn-dedicated-domain-add.controller';

const moduleName = 'cdnDedicatedDomainAdd';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('CdnAddDomainsCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('domain/add/cdn-dedicated-domain-add.html', template);
    },
  );

export default moduleName;
