import routing from './game-firewall.routing';

const moduleName = 'ovhManagerIpDashboardGameFirewall';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
