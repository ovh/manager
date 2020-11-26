import angular from 'angular';

import '@uirouter/angularjs';

import image from './image';

import routing from './routing';
import service from './service';

const moduleName = 'ovhManagerDedicatedServerInstall';

angular
  .module(moduleName, ['ui.router', image])
  .config(routing)
  .service('dedicatedServerInstall', service);

export default moduleName;
