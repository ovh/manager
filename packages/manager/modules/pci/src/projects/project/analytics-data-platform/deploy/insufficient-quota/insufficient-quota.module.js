import angular from 'angular';

import component from './insufficient-quota.component';
import routing from './insufficient-quota.routing';

const moduleName = 'adpDeployInsufficientQuota';

angular
  .module(moduleName, [])
  .config(routing)
  .component('analyticsDataPlatformDeployInsufficientQuota', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
