import angular from 'angular';

import associateIpBloc from './associate-ip-bloc';
import dashboardComponent from '../../components/dedicated-cloud/dashboard';
import deleteZerto from './deleteZerto';
import zertoDatacenterSelection from './zertoDatacenterSelection';
import mailingListSubscribe from './mailing-list/subscribe';
import routing from './dashboard.routing';
import securityOptions from './security-options';
import servicePackUpgrade from '../service-pack/upgrade';
import terminate from './terminate';
import update from './update';
import vmwareOptionDisable from './vmware-option/disable';
import vmwareOptionOrder from './vmware-option/order';
import vcdOrder from './vmware-cloud-director/order';
import dashboardLight from '../dashboard-light';

const moduleName = 'managedBaremetalDashboardModule';

angular
  .module(moduleName, [
    associateIpBloc,
    dashboardComponent,
    deleteZerto,
    zertoDatacenterSelection,
    mailingListSubscribe,
    securityOptions,
    servicePackUpgrade,
    terminate,
    update,
    vmwareOptionDisable,
    vmwareOptionOrder,
    vcdOrder,
    dashboardLight,
  ])
  .config(routing);

export default moduleName;
