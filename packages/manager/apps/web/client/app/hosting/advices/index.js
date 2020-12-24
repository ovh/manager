import angular from 'angular';
import 'angular-translate';

import ovhManagerAdvices from '@ovh-ux/manager-advices';

import component from './advice-hosting.component';

const moduleName = 'ovhManagerHostingAdvices';

angular
  .module(moduleName, [ovhManagerAdvices])
  .component('hostingAdvices', component);

export default moduleName;
