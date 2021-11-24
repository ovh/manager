import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './cdn-dedicated-domain-rule-update.html';
import controller from './cdn-dedicated-domain-rule-update.controller';

const moduleName = 'cdnDedicatedDomainRuleUpdate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('CacherulesModifyTtlCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'cdn/dedicated/domain/rule/update/cdn-dedicated-domain-rule-update.html',
        template,
      );
    },
  );

export default moduleName;
