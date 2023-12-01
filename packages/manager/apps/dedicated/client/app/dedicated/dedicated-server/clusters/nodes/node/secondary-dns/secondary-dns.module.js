import angular from 'angular';
import '@uirouter/angularjs';
import { serverSecondaryDns } from '@ovh-ux/manager-bm-server-components';

import addDns from './add';
import deleteDns from './delete';
import routing from './secondary-dns.routing';

const moduleName = 'ovhManagerDedicatedClusterNodeSecondaryDns';

angular
  .module(moduleName, ['ui.router', serverSecondaryDns, addDns, deleteDns])
  .config(routing);

export default moduleName;
