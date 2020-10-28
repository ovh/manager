import packXdslAccessProfil from './access/profil/pack-xdsl-access-profil.html';
import xdslAccessLnsRatelimit from './access/rateLimit/xdsl-access-lns-ratelimit.html';

export default /* @ngInject */ ($templateCache) => {
  // import templates required by ng-include
  $templateCache.put(
    'app/telecom/pack/xdsl/access/profil/pack-xdsl-access-profil.html',
    packXdslAccessProfil,
  );
  $templateCache.put(
    'app/telecom/pack/xdsl/access/rateLimit/xdsl-access-lns-ratelimit.html',
    xdslAccessLnsRatelimit,
  );
};
