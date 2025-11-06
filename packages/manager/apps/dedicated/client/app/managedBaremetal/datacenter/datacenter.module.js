import angular from 'angular';

import backup from './backup';
import dashboard from './dashboard';
import datacenterComponent from '../../components/dedicated-cloud/datacenter';
import datastore from './datastore';
import zerto from './zerto';
import host from './host';
import routing from './datacenter.routing';
import virtualMachine from './virtualMachine';

const moduleName = 'managedBaremetalDatacenter';

angular
  .module(moduleName, [
    backup,
    dashboard,
    datacenterComponent,
    datastore,
    zerto,
    host,
    virtualMachine,
  ])
  .config(routing);

export default moduleName;
