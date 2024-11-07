import angular from 'angular';
import '@uirouter/angularjs';

import routing from './assign-tags.routing';

const moduleName = 'ovhManagerDedicatedClusterNodeAssignTags';

angular.module(moduleName, ['ui.router']).config(routing);

export default moduleName;
