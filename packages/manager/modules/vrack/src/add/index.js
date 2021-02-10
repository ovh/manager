import angular from 'angular';
import '@ovh-ux/ng-ovh-contracts';
import '@uirouter/angularjs';

import controller from './vrack-add.controller';
import routing from './vrack-add.routing';

import './vrack-add.less';

const moduleName = 'ovhManagerVrackAdd';

angular
  .module(moduleName, ['ngOvhContracts', 'ui.router'])
  .config(routing)
  .controller('VrackAddCtrl', controller);

export default moduleName;
