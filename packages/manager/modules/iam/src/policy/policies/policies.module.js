import angular from 'angular';

import advancedModeSwitch from '../../components/advancedModeSwitch';
import cursorDatagrid from '../../components/cursorDatagrid';

import deleteModule from './delete';

import component from './policies.component';
import routing from './policies.routing';

const moduleName = 'ovhManagerIAMPolicyPolicies';

angular
  .module(moduleName, [advancedModeSwitch, cursorDatagrid, deleteModule])
  .component('iamPolicies', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
