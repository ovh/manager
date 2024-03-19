import angular from 'angular';
import '@uirouter/angularjs';
import { serverReverseDnsDelete } from '@ovh-ux/manager-bm-server-components';

import routing from './reverse-dns-delete.routing';

const moduleName = 'ovhManagerDedicatedClusterNodeReverseDnsDelete';

angular
  .module(moduleName, ['ui.router', serverReverseDnsDelete])
  .config(routing);

export default moduleName;
