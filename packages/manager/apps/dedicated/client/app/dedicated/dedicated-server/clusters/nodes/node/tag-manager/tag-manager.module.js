import angular from 'angular';
import '@uirouter/angularjs';
import resourceTagging from '@ovh-ux/manager-resource-tagging';
import tagAssign from './tag-assign';

import routing from './tag-manager.routing';

const moduleName = 'ovhManagerDedicatedClusterTagManager';

angular
  .module(moduleName, ['ui.router', resourceTagging, tagAssign])
  .config(routing);

export default moduleName;
