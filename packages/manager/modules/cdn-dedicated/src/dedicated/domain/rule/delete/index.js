import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './cdn-dedicated-domain-rule-delete.html';
import controller from './cdn-dedicated-domain-rule-delete.controller';

const moduleName = 'cdnDedicatedDomainRuleDelete';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('CacherulesDeleteCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'cdn/dedicated/domain/rule/delete/cdn-dedicated-domain-rule-delete.html',
        template,
      );
    },
  );

export default moduleName;
