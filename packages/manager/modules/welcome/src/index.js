import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import routing from './manager-welcome.routes';

const moduleName = 'ovhManagerWelcome';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(routing);

export default moduleName;
