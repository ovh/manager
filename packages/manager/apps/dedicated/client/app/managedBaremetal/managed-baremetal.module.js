import angular from 'angular';

import confirmTerminate from './confirm-terminate';
import dashboard from './dashboard/dashboard.module';
import datacenter from './datacenter';
import datacenters from './datacenters';
import dedicatedCloudComponent from '../components/dedicated-cloud';
import license from './license';
import operation from './operation';
import routing from './managed-baremetal.routing';
import security from './security';
import servicePackUpgrade from './service-pack/upgrade';
import user from './user';

const moduleName = 'managedBaremetalModule';

angular
  .module(moduleName, [
    confirmTerminate,
    dashboard,
    datacenter,
    datacenters,
    dedicatedCloudComponent,
    license,
    operation,
    security,
    servicePackUpgrade,
    user,
  ])
  .config(routing);

export default moduleName;
