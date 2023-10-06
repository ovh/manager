import '@uirouter/angularjs';

import routing from './gabarit.routing';

const moduleName =
  'ovhManagerDedicatedServerDashboardServerInstallationGabarit';

angular.module(moduleName, ['ui.router']).config(routing);

export default moduleName;
