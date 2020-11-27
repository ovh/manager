import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './statistics.controller';
import template from './statistics.html';

const moduleName = 'ovhManagerTelecomPackXdslStatistics';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .controller('XdslStatisticsCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/pack/xdsl/access/statistics/statistics.html',
        template,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
