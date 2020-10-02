import routing from './firewall.routing';

import game from './game/game-firewall.module';

const moduleName = 'ovhManagerIpDashboardFirewall';

angular
  .module(moduleName, [game])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
