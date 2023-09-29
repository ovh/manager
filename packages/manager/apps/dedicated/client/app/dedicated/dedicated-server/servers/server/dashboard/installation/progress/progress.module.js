import '@uirouter/angularjs';

import routing from './progress.routing';

const moduleName =
  'ovhManagerDedicatedServerDashboardServerInstallationProgress';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
