import angular from 'angular';

import cursorDatagrid from '../../components/cursorDatagrid';

import deleteModule from './delete';

import component from './resourceGroups.component';
import routing from './resourceGroups.routing';

const moduleName = 'ovhManagerIAMPolicyResourceGroups';

angular
  .module(moduleName, [cursorDatagrid, deleteModule])
  .component('iamResourceGroups', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
