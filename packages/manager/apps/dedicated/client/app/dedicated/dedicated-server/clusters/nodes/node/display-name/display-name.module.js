import angular from 'angular';
import '@uirouter/angularjs';
import { serverDisplayName } from '@ovh-ux/manager-bm-server-components';

import routing from './display-name.routing';

const moduleName = 'ovhManagerDedicatedClusterNodeDisplayName';

angular.module(moduleName, ['ui.router', serverDisplayName]).config(routing);

export default moduleName;
