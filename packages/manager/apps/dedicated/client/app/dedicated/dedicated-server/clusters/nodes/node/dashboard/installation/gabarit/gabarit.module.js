import '@uirouter/angularjs';

import routing from './gabarit.routing';

const moduleName =
  'ovhManagerDedicatedClusterNodeDashboardServerInstallationGabarit';

angular.module(moduleName, ['ui.router']).config(routing);

export default moduleName;
