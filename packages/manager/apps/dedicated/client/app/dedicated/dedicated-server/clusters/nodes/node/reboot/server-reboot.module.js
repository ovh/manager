import angular from 'angular';
import '@uirouter/angularjs';
import { serverReboot } from '@ovh-ux/manager-bm-server-components';

import routing from './server-reboot.routing';

const moduleName = 'ovhManagerDedicatedClusterNodeReboot';

angular.module(moduleName, ['ui.router', serverReboot]).config(routing);

export default moduleName;
