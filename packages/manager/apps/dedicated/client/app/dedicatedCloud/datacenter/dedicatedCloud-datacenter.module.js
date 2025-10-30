import angular from 'angular';

import backup from './backup';
import dashboard from './dashboard';
import datacenterComponent from '../../components/dedicated-cloud/datacenter';
import datastore from './datastore';
import zerto from './zerto';
import drp from './drp';
import host from './host';
import network from './network';
import virtualMachine from './virtualMachine';
import routing from './dedicatedCloud-datacenter.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenter';

angular
  .module(moduleName, [
    backup,
    dashboard,
    datacenterComponent,
    datastore,
    zerto,
    drp,
    host,
    network,
    virtualMachine,
  ])
  .config(routing);

export default moduleName;
