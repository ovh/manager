import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-update-quota.routing';
import updateQuotaComponent from './iplb-update-quota.component';

const moduleName = 'ovhManagerIplbUpdateQuotaModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbUpdateQuota', updateQuotaComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
