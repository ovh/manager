import '@uirouter/angularjs';

import routing from './ovh.routing';

const moduleName =
  'ovhManagerDedicatedClusterNodeDashboardServerInstallationOvh';

angular.module(moduleName, ['ui.router']).config(routing);

export default moduleName;
