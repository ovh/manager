import angular from 'angular';
import '@uirouter/angularjs';

import routing from './cdn-dedicated.routes';

const moduleName = 'ovhManagerCdnDedicated';

angular.module(moduleName, ['ui.router']).config(routing);

export default moduleName;
