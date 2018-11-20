import angular from 'angular';
import '@uirouter/angularjs';
import ocLazyLoad from 'oclazyload';
import '@ovh-ux/manager-core';

import routing from './manager-welcome.routes';

const moduleName = 'ovhManagerWelcome';

angular.module(moduleName, [
  ocLazyLoad,
  'ui.router',
  'ovhManagerCore',
]).config(routing);

export default moduleName;
