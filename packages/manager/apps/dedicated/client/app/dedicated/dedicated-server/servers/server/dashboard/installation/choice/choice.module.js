import '@uirouter/angularjs';

import routing from './choice.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardServerInstallationChoice';

angular.module(moduleName, ['ui.router']).config(routing);

export default moduleName;
