import angular from 'angular';

import confirmTerminate from '../confirm-terminate';
import dashboard from '../dashboard/dedicatedCloud-dashboard.module';
import datacenters from '../datacenters';
import dedicatedCloudComponent from '../../components/dedicated-cloud';
import license from '../license';
import logs from '../logs';
import operation from '../operation';
import security from '../security';
import servicePackUpgrade from '../service-pack/upgrade';
import user from '../users';

import routing from './dedicatedCloud.routing';

const moduleName = 'ovhManagerDedicatedCloudModule';

angular
  .module(moduleName, [
    confirmTerminate,
    dashboard,
    datacenters,
    dedicatedCloudComponent,
    license,
    logs,
    operation,
    security,
    servicePackUpgrade,
    user,
  ])
  .config(routing);

export default moduleName;
