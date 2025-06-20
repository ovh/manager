import angular from 'angular';
import '@uirouter/angularjs';
import resourceTagging from '@ovh-ux/manager-resource-tagging';
import tagAssign from './tag-assign';
import tagUnassign from './tag-unassign';

import routing from './tag-manager.routing';

const moduleName = 'ovhManagerDedicatedServerTagManager';

angular
  .module(moduleName, ['ui.router', resourceTagging, tagAssign, tagUnassign])
  .config(routing);

export default moduleName;
