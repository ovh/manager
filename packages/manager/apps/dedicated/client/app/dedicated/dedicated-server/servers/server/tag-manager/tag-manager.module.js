import angular from 'angular';
import '@uirouter/angularjs';
import resourceTagging from '@ovh-ux/manager-resource-tagging';

import routing from './tag-manager.routing';

const moduleName = 'ovhManagerDedicatedServerTagManager';

angular.module(moduleName, ['ui.router', resourceTagging]).config(routing);

export default moduleName;
