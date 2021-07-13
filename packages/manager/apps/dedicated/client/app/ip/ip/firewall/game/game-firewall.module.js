import routing from './game-firewall.routing';
import service from './ip-ip-firewall-game.service';

import ruleAddController from './rule/add/ip-ip-firewall-game-rule-add.controller';
import ruleAddTemplate from './rule/add/ip-ip-firewall-game-rule-add.html';
import ruleDeleteController from './rule/delete/ip-ip-firewall-game-rule-delete.controller';
import ruleDeleteTemplate from './rule/delete/ip-ip-firewall-game-rule-delete.html';
import toggleController from './toggle/ip-ip-firewall-game-toggle.controller';
import toggleTemplate from './toggle/ip-ip-firewall-game-toggle.html';

const moduleName = 'ovhManagerIpDashboardGameFirewall';

angular
  .module(moduleName, [])
  .config(routing)
  .controller('AddGameFirewallRuleCtrl', ruleAddController)
  .controller('EnableDisableGameFirewallRuleCtrl', toggleController)
  .controller('RemoveGameFirewallRuleCtrl', ruleDeleteController)
  .service('IpGameFirewall', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'ip/firewall/game/rule/add/ip-ip-firewall-game-rule-add.html',
        ruleAddTemplate,
      );
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
