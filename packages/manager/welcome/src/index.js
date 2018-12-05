import angular from 'angular';
import '@uirouter/angularjs';
import ocLazyLoad from 'oclazyload';

import routing from './manager-welcome.routes';

const moduleName = 'ovhManagerWelcome';

angular.module(moduleName, [
  ocLazyLoad,
  'ui.router',
]).config(routing);

export default moduleName;
