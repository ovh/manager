import angular from 'angular';
import '@uirouter/angularjs';

import controller from './vrack-add.controller';
import routing from './vrack-add.routing';

import './vrack-add.less';

const moduleName = 'ovhManagerVrackAdd';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(routing)
  .controller('VrackAddCtrl', controller);

export default moduleName;
