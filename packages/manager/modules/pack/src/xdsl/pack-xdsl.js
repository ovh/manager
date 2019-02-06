import packXdslAccessIpv6 from './access/ipv6/pack-xdsl-access-ipv6.html';
import packXdslAccessProfil from './access/profil/pack-xdsl-access-profil.html';
import xdslAccessLnsRatelimit from './access/rateLimit/xdsl-access-lns-ratelimit.html';
import packXdslAccessPortReset from './access/portReset/pack-xdsl-access-port-reset.html';
import packXdslStatistics from './access/statistics/pack-xdsl-statistics.html';

angular.module('managerApp').run(($templateCache) => {
  // import templates required by ng-include
  $templateCache.put('app/telecom/pack/xdsl/access/ipv6/pack-xdsl-access-ipv6.html', packXdslAccessIpv6);
  $templateCache.put('app/telecom/pack/xdsl/access/profil/pack-xdsl-access-profil.html', packXdslAccessProfil);
  $templateCache.put('app/telecom/pack/xdsl/access/rateLimit/xdsl-access-lns-ratelimit.html', xdslAccessLnsRatelimit);
  $templateCache.put('app/telecom/pack/xdsl/access/portReset/pack-xdsl-access-port-reset.html', packXdslAccessPortReset);
  $templateCache.put('app/telecom/pack/xdsl/access/statistics/pack-xdsl-statistics.html', packXdslStatistics);
});

angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.xdsl', {
    url: '/xdsl/:serviceName/lines/:number',
    views: {
      'packView@telecom.pack': {
        templateUrl: 'app/telecom/pack/xdsl/pack-xdsl.html',
        controller: 'PackXdslCtrl',
        controllerAs: 'PackXdslCtrl',
      },
      'xdslView@telecom.pack.xdsl': {
        controller: 'XdslAccessCtrl',
        controllerAs: 'XdslAccess',
        templateUrl: 'app/telecom/pack/xdsl/access/pack-xdsl-access.html',
      },
    },
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
        return OvhApiXdsl.v6().get({
          xdslId: $stateParams.serviceName,
        }).$promise.then(data => $translate.instant('xdsl_page_title', { name: data.description || $stateParams.serviceName }, null, null, 'escape')).catch(() => $translate('xdsl_page_title', { name: $stateParams.serviceName }));
      },
    },
  });
});
