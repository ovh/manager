import '@uirouter/angularjs';

import routing from './progress.routing';

const moduleName =
  'ovhManagerDedicatedClusterNodeDashboardServerInstallationProgress';

angular.module(moduleName, ['ui.router']).config(routing);

export default moduleName;
