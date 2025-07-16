import angular from 'angular';

import datacenterDashboardComponent from '../../../components/dedicated-cloud/datacenter/dashboard';
import deleteDatacenter from './delete';
import deleteZerto from './deleteZerto';
import routing from './dashboard.routes';

const moduleName = 'managedBaremetalDatacenterDashboard';

angular
  .module(moduleName, [
    datacenterDashboardComponent,
    deleteDatacenter,
    deleteZerto,
  ])
  .config(routing);

export default moduleName;
