import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './cdn-dedicated-domain-rule-add.html';
import controller from './cdn-dedicated-domain-rule-add.controller';

const moduleName = 'cdnDedicatedDomainRuleAdd';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('CacherulesCreateCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'cdn/dedicated/domain/rule/add/cdn-dedicated-domain-rule-add.html',
        template,
      );
    },
  );

export default moduleName;
