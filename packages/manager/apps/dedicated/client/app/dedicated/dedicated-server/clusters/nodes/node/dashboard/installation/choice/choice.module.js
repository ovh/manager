import '@uirouter/angularjs';

import routing from './choice.routing';

const moduleName =
  'ovhManagerDedicatedClusterNodeDashboardServerInstallationChoice';

angular.module(moduleName, ['ui.router']).config(routing);

export default moduleName;
