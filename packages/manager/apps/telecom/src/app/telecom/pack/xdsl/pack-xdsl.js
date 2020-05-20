import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import 'ovh-ui-angular';

import packXdslAccessIpv6 from './access/ipv6/pack-xdsl-access-ipv6.html';
import packXdslAccessProfil from './access/profil/pack-xdsl-access-profil.html';
import xdslAccessLnsRatelimit from './access/rateLimit/xdsl-access-lns-ratelimit.html';
import packXdslAccessPortReset from './access/portReset/pack-xdsl-access-port-reset.html';
import packXdslStatistics from './access/statistics/pack-xdsl-statistics.html';
import packXdslAccess from './access';

import routing from './pack-xdsl.routing';

const moduleName = 'ovhManagerTelecomPackXdsl';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    'oui',
    packXdslAccess,
  ])
  .config(routing)
  .run(($templateCache) => {
    // import templates required by ng-include
    $templateCache.put(
      'app/telecom/pack/xdsl/access/ipv6/pack-xdsl-access-ipv6.html',
      packXdslAccessIpv6,
    );
    $templateCache.put(
      'app/telecom/pack/xdsl/access/profil/pack-xdsl-access-profil.html',
      packXdslAccessProfil,
    );
    $templateCache.put(
      'app/telecom/pack/xdsl/access/rateLimit/xdsl-access-lns-ratelimit.html',
      xdslAccessLnsRatelimit,
    );
    $templateCache.put(
      'app/telecom/pack/xdsl/access/portReset/pack-xdsl-access-port-reset.html',
      packXdslAccessPortReset,
    );
    $templateCache.put(
      'app/telecom/pack/xdsl/access/statistics/pack-xdsl-statistics.html',
      packXdslStatistics,
    );
  });

export default moduleName;
