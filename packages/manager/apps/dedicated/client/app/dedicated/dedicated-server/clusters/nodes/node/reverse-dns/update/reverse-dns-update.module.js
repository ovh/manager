import angular from 'angular';
import '@uirouter/angularjs';
import { serverReverseDnsUpdate } from '@ovh-ux/manager-bm-server-components';

import routing from './reverse-dns-update.routing';

const moduleName = 'ovhManagerDedicatedClusterNodeReverseDnsUpdate';

angular
  .module(moduleName, ['ui.router', serverReverseDnsUpdate])
  .config(routing);

export default moduleName;
