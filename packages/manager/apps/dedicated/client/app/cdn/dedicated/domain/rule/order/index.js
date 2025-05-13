import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './cdn-dedicated-domain-rule-order.html';
import controller from './cdn-dedicated-domain-rule-order.controller';
import service from './cdn-dedicated-domain-rule-order.service';

const moduleName = 'cdnDedicatedDomainRuleOrder';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .service('cdnDedicatedOrderRule', service)
  .controller('CacherulesAddCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'domain/rule/order/cdn-dedicated-domain-rule-order.html',
        template,
      );
    },
  );

export default moduleName;
