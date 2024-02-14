import routing from './firewall.routing';

import game from './game/game-firewall.module';
import service from './ip-ip-firewall-rule.service';

import ruleDeleteController from './rule/delete/ip-ip-firewall-rule-delete.controller';
import ruleDeleteTemplate from './rule/delete/ip-ip-firewall-rule-delete.html';

import toggleController from './toggle/ip-ip-firewall-toggle.controller';
import toggleTemplate from './toggle/ip-ip-firewall-toggle.html';
import './firewall.styles.scss';

const moduleName = 'ovhManagerIpDashboardFirewall';

angular
  .module(moduleName, [game])
  .config(routing)
  .controller('IpFirewallRemoveRuleCtrl', ruleDeleteController)
  .controller('IpFirewallToggleCtrl', toggleController)
  .service('IpFirewall', service)
  .run(
    /* @ngInject */ ($templateCache) => {
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
