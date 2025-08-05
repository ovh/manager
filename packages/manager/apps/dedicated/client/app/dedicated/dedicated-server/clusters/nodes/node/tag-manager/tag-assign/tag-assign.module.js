import angular from 'angular';
import '@uirouter/angularjs';
import resourceTagging from '@ovh-ux/manager-resource-tagging';

import routing from './tag-assign.routing';

const moduleName = 'ovhManagerDedicatedClusterTagManagerAssign';

angular.module(moduleName, ['ui.router', resourceTagging]).config(routing);

export default moduleName;
