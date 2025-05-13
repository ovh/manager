import angular from 'angular';

import datacenterDashboardComponent from '../../../components/dedicated-cloud/datacenter/dashboard';
import deleteDatacenter from './delete';
import deleteDrp from './deleteDrp';
import routing from './dashboard.routes';

const moduleName = 'managedBaremetalDatacenterDashboard';

angular
  .module(moduleName, [
    datacenterDashboardComponent,
    deleteDatacenter,
    deleteDrp,
  ])
  .config(routing);

export default moduleName;
