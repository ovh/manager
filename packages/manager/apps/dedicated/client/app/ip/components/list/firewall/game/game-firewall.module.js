import routing from './game-firewall.routing';
import service from './ip-ip-firewall-game.service';

import ruleDeleteController from './rule/delete/ip-ip-firewall-game-rule-delete.controller';
import ruleDeleteTemplate from './rule/delete/ip-ip-firewall-game-rule-delete.html';
import toggleController from './toggle/ip-ip-firewall-game-toggle.controller';
import toggleTemplate from './toggle/ip-ip-firewall-game-toggle.html';

const moduleName = 'ovhManagerIpDashboardGameFirewall';

angular
  .module(moduleName, [])
  .config(routing)
  .controller('EnableDisableGameFirewallRuleCtrl', toggleController)
  .controller('RemoveGameFirewallRuleCtrl', ruleDeleteController)
  .service('IpGameFirewall', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'ip/firewall/game/rule/delete/ip-ip-firewall-game-rule-delete.html',
        ruleDeleteTemplate,
      );
      $templateCache.put(
        'ip/firewall/game/toggle/ip-ip-firewall-game-toggle.html',
        toggleTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
