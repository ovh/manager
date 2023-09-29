import '@uirouter/angularjs';

import routing from './ovh.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardServerInstallationOvh';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
