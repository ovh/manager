import angular from 'angular';

import component from './ipv6.component';
import service from './ipv6.service';

const moduleName = 'ovhManagerVrackAssignedIpv6Service';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('vrackAssignedIpv6', component)
  .service('vrackAssignedIpv6Service', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
