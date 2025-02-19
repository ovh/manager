import angular from 'angular';

import datacenterDashboardComponent from '../../../components/dedicated-cloud/datacenter/dashboard';
import deleteDatacenter from './delete';
import deleteDrp from './deleteDrp';
import manageNsxEdges from './manage-nsx-edges';
import routing from './dedicatedCloud.datacenter.dashboard.routes';
import moveNsxtEdge from './move-nsxt-edge';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDetailsDashboard';

angular
  .module(moduleName, [
    datacenterDashboardComponent,
    deleteDatacenter,
    deleteDrp,
    manageNsxEdges,
    moveNsxtEdge,
  ])
  .config(routing);

export default moduleName;
