import angular from 'angular';
import '@ovh-ux/ng-ovh-responsive-tabs';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import access from './access';
import tasks from './tasks';

import controller from './controller';
import template from './template.html';

// import packXdslAccessIpv6 from './access/ipv6/pack-xdsl-access-ipv6.html';
// import packXdslAccessProfil from './access/profil/pack-xdsl-access-profil.html';
import xdslAccessLnsRatelimit from './access/rateLimit/xdsl-access-lns-ratelimit.html';
import packXdslAccessPortReset from './access/portReset/pack-xdsl-access-port-reset.html';
import packXdslStatistics from './access/statistics/pack-xdsl-statistics.html';

const moduleName = 'ovhManagerPackXdslModule';

angular
  .module(moduleName, [
    access,
    'ngOvhResponsiveTabs',
    'ngOvhTelecomUniverseComponents',
    'ovh-api-services',
    'pascalprecht.translate',
    'smoothScroll',
    tasks,
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pack.xdsl', {
      url: '/xdsl/:serviceName/lines/:number',
      template,
      controller,
      controllerAs: 'PackXdslCtrl',
      abstract: true,
      translations: [
        '../common',
        '.',
        './access',
        './access/deconsolidation',
        './access/statistics',
        './access/ipv6',
        './access/portReset',
        './access/profil',
        './access/rateLimit',
        './access/ip/order',
        './orderFollowUp',
      ],
      resolve: {
        $title(translations, $translate, $stateParams, OvhApiXdsl) {
          return OvhApiXdsl
            .v6()
            .get({
              xdslId: $stateParams.serviceName,
            })
            .$promise
            .then(data => $translate.instant('xdsl_page_title', { name: data.description || $stateParams.serviceName }, null, null, 'escape'))
            .catch(() => $translate('xdsl_page_title', { name: $stateParams.serviceName }));
        },
      },
    });
  })
  .run(/* @ngInject */($templateCache) => {
    // import templates required by ng-include
    // $templateCache.put('app/telecom/pack/xdsl/access/ipv6/pack-xdsl-access-ipv6.html', packXdslAccessIpv6);
    // $templateCache.put('app/telecom/pack/xdsl/access/profil/pack-xdsl-access-profil.html', packXdslAccessProfil);
    $templateCache.put('app/telecom/pack/xdsl/access/rateLimit/xdsl-access-lns-ratelimit.html', xdslAccessLnsRatelimit);
    $templateCache.put('app/telecom/pack/xdsl/access/portReset/pack-xdsl-access-port-reset.html', packXdslAccessPortReset);
    $templateCache.put('app/telecom/pack/xdsl/access/statistics/pack-xdsl-statistics.html', packXdslStatistics);
  });

export default moduleName;
