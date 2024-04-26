import angular from 'angular';

import component from './ip.component';
import service from './ip.service';

const moduleName = 'ovhManagerVrackAssignedIpService';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('vrackAssignedIp', component)
  .service('vrackAssignedIpService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
