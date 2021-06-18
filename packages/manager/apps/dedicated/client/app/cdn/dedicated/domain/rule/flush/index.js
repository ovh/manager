import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './cdn-dedicated-domain-rule-flush.html';
import controller from './cdn-dedicated-domain-rule-flush.controller';

const moduleName = 'cdnDedicatedDomainRuleDelete';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('CdnFlushRuleCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'domain/rule/flush/cdn-dedicated-domain-rule-flush.html',
        template,
      );
    },
  );

export default moduleName;
