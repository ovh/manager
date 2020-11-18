import angular from 'angular';

import confirmTerminate from './confirm-terminate';
import datacenter from './datacenter';
import datacenters from './datacenters';
import dedicatedCloudComponent from '../components/dedicated-cloud';
import license from './license';
import operation from './operation';
import routing from './managed-baremetal.routing';
import security from './security';
import servicePackUpgrade from './service-pack/upgrade';
import user from './user';
import associateIpBloc from './dashboard/associate-ip-bloc';
import deleteDrp from './dashboard/deleteDrp';
import drpDatacenterSelection from './dashboard/drpDatacenterSelection';
import mailingListSubscribe from './dashboard/mailing-list/subscribe';
import securityOptions from './dashboard/security-options';
import terminate from './dashboard/terminate';
import update from './dashboard/update';
import vmwareOptionDisable from './dashboard/vmware-option/disable';
import vmwareOptionOrder from './dashboard/vmware-option/order';

const moduleName = 'managedBaremetalModule';

angular
  .module(moduleName, [
    confirmTerminate,
    datacenter,
    datacenters,
    dedicatedCloudComponent,
    license,
    operation,
    security,
    servicePackUpgrade,
    user,
    associateIpBloc,
    deleteDrp,
    drpDatacenterSelection,
    mailingListSubscribe,
    securityOptions,
    terminate,
    update,
    vmwareOptionDisable,
    vmwareOptionOrder,
  ])
  .config(routing);

export default moduleName;
