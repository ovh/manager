import '@uirouter/angularjs';

import routing from './choice.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardServerInstallationChoice';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
