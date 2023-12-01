import angular from 'angular';
import '@uirouter/angularjs';

import { serverMonitoring } from '@ovh-ux/manager-bm-server-components';
import routing from './monitoring.routing';

const moduleName = 'ovhManagerDedicatedClusterNodeMonitoring';

angular.module(moduleName, ['ui.router', serverMonitoring]).config(routing);

export default moduleName;
