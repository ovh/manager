import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import controller from './cdn-dedicated-domain-rule-activate.controller';
import template from './cdn-dedicated-domain-rule-activate.html';

import activateAllCtrl from './all/cdn-dedicated-domain-rule-activate-all.controller';
import activateAllTemplate from './all/cdn-dedicated-domain-rule-activate-all.html';

const moduleName = 'cdnDedicatedDomainRuleActivate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('CacherulesActivateCtrl', controller)
  .controller('CacherulesActivateAllCtrl', activateAllCtrl)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'domain/rule/activate/cdn-dedicated-domain-rule-activate.html',
        template,
      );
      $templateCache.put(
        'domain/rule/activate/all/cdn-dedicated-domain-rule-activate-all.html',
        activateAllTemplate,
      );
    },
  );

export default moduleName;
