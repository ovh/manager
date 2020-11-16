import angular from 'angular';

import backup from './backup';
import dashboard from './dashboard';
import datacenterComponent from '../../components/dedicated-cloud/datacenter';
import datastore from './datastore';
import drp from './drp';
import host from './host';
import routing from './dedicatedCloud-datacenter.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterHost';

angular
  .module(moduleName, [
    backup,
    dashboard,
    datacenterComponent,
    datastore,
    drp,
    host,
  ])
  .config(routing);

export default moduleName;
