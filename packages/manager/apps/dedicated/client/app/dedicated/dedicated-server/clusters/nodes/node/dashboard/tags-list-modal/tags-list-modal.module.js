import angular from 'angular';
import '@uirouter/angularjs';
import resourceTagging from '@ovh-ux/manager-resource-tagging';

import routing from './tags-list-modal.routing';

const moduleName = 'ovhManagerDedicatedClusterTagsListModal';

angular.module(moduleName, ['ui.router', resourceTagging]).config(routing);

export default moduleName;
