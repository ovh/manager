import angular from 'angular';

import associateIpBloc from './associate-ip-bloc';
import dashboardComponent from '../../components/dedicated-cloud/dashboard';
import deleteDrp from './deleteDrp';
import drpDatacenterSelection from './drpDatacenterSelection';
import mailingListSubscribe from './mailing-list/subscribe';
import routing from './dashboard.routing';
import securityOptions from './security-options';
import servicePackUpgrade from '../service-pack/upgrade';
import terminate from './terminate';
import update from './update';
import vmwareOptionDisable from './vmware-option/disable';
import vmwareOptionOrder from './vmware-option/order';

const moduleName = 'managedBaremetalDashboardModule';

angular
  .module(moduleName, [
    associateIpBloc,
    dashboardComponent,
    deleteDrp,
    drpDatacenterSelection,
    mailingListSubscribe,
    securityOptions,
    servicePackUpgrade,
    terminate,
    update,
    vmwareOptionDisable,
    vmwareOptionOrder,
  ])
  .config(routing);

export default moduleName;
