import angular from 'angular';
import 'angular-translate';

import ovhManagerAdvices from '@ovh-ux/manager-advices';

import component from './advice-instance.component';

const moduleName = 'ovhManagerInstanceAdvices';

angular
  .module(moduleName, [ovhManagerAdvices])
  .component('instanceAdvices', component);

export default moduleName;
