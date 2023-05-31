import angular from 'angular';

import cursorDatagrid from '../../components/cursorDatagrid';

import component from './policies.component';
import routing from './policies.routing';

const moduleName = 'ovhManagerIAMPolicies';

angular
  .module(moduleName, [cursorDatagrid])
  .component('iamPolicies', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
