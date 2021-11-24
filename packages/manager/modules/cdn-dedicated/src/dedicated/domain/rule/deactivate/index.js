import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import controller from './cdn-dedicated-domain-rule-deactivate.controller';
import template from './cdn-dedicated-domain-rule-deactivate.html';

import deactivateAllCtrl from './all/cdn-dedicated-domain-rule-deactivate-all.controller';
import deactivateAllTemplate from './all/cdn-dedicated-domain-rule-deactivate-all.html';

const moduleName = 'cdnDedicatedDomainRuleDeactivate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('CacherulesDesactivateCtrl', controller)
  .controller('CacherulesDesactivateAllCtrl', deactivateAllCtrl)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'cdn/dedicated/domain/rule/deactivate/cdn-dedicated-domain-rule-deactivate.html',
        template,
      );
      $templateCache.put(
        'cdn/dedicated/domain/rule/deactivate/all/cdn-dedicated-domain-rule-deactivate-all.html',
        deactivateAllTemplate,
      );
    },
  );

export default moduleName;
