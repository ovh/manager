import angular from 'angular';

import component from './ipv6.component';
import service from './ipv6.service';
import slaacHelp from './slaac-help.html';

const moduleName = 'ovhManagerVrackAssignedIpv6Service';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('vrackAssignedIpv6', component)
  .service('vrackAssignedIpv6Service', service)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('slaac-help.html', slaacHelp);
    },
  );

export default moduleName;
