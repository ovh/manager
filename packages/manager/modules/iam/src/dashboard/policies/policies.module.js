import angular from 'angular';

import advancedModeSwitch from '../../components/advancedModeSwitch';

import deleteModule from './delete';

import component from './policies.component';
import routing from './policies.routing';

const moduleName = 'ovhManagerIAMDashboardPolicies';

angular
  .module(moduleName, [advancedModeSwitch, deleteModule])
  .component('iamPolicies', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
