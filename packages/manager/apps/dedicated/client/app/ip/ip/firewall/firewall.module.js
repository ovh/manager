import routing from './firewall.routing';

import game from './game/game-firewall.module';
import service from './ip-ip-firewall-rule.service';

import ruleAddController from './rule/add/ip-ip-firewall-rule-add.controller';
import ruleAddTemplate from './rule/add/ip-ip-firewall-rule-add.html';

import ruleDeleteController from './rule/delete/ip-ip-firewall-rule-delete.controller';
import ruleDeleteTemplate from './rule/delete/ip-ip-firewall-rule-delete.html';

import toggleController from './toggle/ip-ip-firewall-toggle.controller';
import toggleTemplate from './toggle/ip-ip-firewall-toggle.html';

const moduleName = 'ovhManagerIpDashboardFirewall';

angular
  .module(moduleName, [game])
  .config(routing)
  .controller('IpFirewallAddRuleCtrl', ruleAddController)
  .controller('IpFirewallRemoveRuleCtrl', ruleDeleteController)
  .controller('IpFirewallToggleCtrl', toggleController)
  .service('IpFirewall', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'ip/firewall/rule/add/ip-ip-firewall-rule-add.html',
        ruleAddTemplate,
      );
      $templateCache.put(
        'ip/firewall/rule/delete/ip-ip-firewall-rule-delete.html',
        ruleDeleteTemplate,
      );
      $templateCache.put(
        'ip/firewall/toggle/ip-ip-firewall-toggle.html',
        toggleTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
