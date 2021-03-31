import angular from 'angular';
import '@uirouter/angularjs';

import component from './onboarding.component';
import routing from './onboarding.routing';

const moduleName = 'ovhManagerWebPaasOnboarding';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('webPaasOnboarding', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
