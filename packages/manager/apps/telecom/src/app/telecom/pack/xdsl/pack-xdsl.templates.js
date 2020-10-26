import packXdslAccessIpv6 from './access/ipv6/pack-xdsl-access-ipv6.html';
import packXdslAccessProfil from './access/profil/pack-xdsl-access-profil.html';
import xdslAccessLnsRatelimit from './access/rateLimit/xdsl-access-lns-ratelimit.html';
import packXdslAccessPortReset from './access/portReset/pack-xdsl-access-port-reset.html';

export default /* @ngInject */ ($templateCache) => {
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
};
