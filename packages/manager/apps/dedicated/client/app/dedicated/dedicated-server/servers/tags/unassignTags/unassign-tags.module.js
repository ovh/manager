import angular from 'angular';
import '@uirouter/angularjs';

import routing from './unassign-tags.routing';

const moduleName = 'ovhManagerDedicatedServerUnassignTags';

angular.module(moduleName, ['ui.router']).config(routing);

export default moduleName;
