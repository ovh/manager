import angular from 'angular';
import '@uirouter/angularjs';
import resourceTagging from '@ovh-ux/manager-resource-tagging';

import routing from './tag-unassign.routing';

const moduleName = 'ovhManagerDedicatedServerTagManagerUnassign';

angular.module(moduleName, ['ui.router', resourceTagging]).config(routing);

export default moduleName;
