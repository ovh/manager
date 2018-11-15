import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ocLazyLoad from 'oclazyload';
import core from '@ovh-ux/manager-core'; // eslint-disable-line import/no-extraneous-dependencies

import routing from './manager-welcome.routes';

const moduleName = 'ovhManagerWelcome';

angular.module(moduleName, [ocLazyLoad, uiRouter, core])
  .config(routing);

export default moduleName;
