import angular from 'angular';

import datacenterDashboardComponent from '../../../components/dedicated-cloud/datacenter/dashboard';
import deleteDatacenter from './delete';
import deleteDrp from './deleteDrp';
import manageNsxEdges from './manage-nsx-edges';
import routing from './dedicatedCloud.datacenter.dashboard.routes';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDashboard';

angular
  .module(moduleName, [
    datacenterDashboardComponent,
    deleteDatacenter,
    deleteDrp,
    manageNsxEdges,
  ])
  .config(routing);

export default moduleName;
