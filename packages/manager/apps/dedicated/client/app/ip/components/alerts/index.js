import angular from 'angular';

import component from './alerts.component';

const moduleName = 'ovhManagerIpComponentsAlerts';

angular
  .module(moduleName, [])
  .component('ipAlerts', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
