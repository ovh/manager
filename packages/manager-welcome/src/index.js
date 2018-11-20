import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ocLazyLoad from 'oclazyload';
import core from '@ovh-ux/manager-core';

import routing from './manager-welcome.routes';

const moduleName = 'ovhManagerWelcome';

angular.module(moduleName, [ocLazyLoad, uiRouter, core])
  .config(routing);

export default moduleName;
