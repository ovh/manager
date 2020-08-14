import packVoipLine from '../slots/voipLine/pack-voipLine.html';
import packTask from '../slots/task/pack-task.html';
import packVoipEcoFax from '../slots/voipEcoFax/pack-voipEcoFax.html';
import packHubic from '../slots/hubic/pack-hubic.html';
import packExchangeAccount from '../slots/exchangeAccount/pack-exchangeAccount.html';
import packXdslAccess from '../slots/xdslAccess/pack-xdslAccess.html';
import packInformations from '../slots/informations/pack-informations.html';
import packPromotionCode from '../slots/promotionCode/pack-promotionCode.html';
import packDomain from '../slots/domain/pack-domain.html';

export default /* @ngInject */ ($templateCache) => {
  // import templates required by ng-include
  $templateCache.put(
    'app/telecom/pack/slots/voipLine/pack-voipLine.html',
    packVoipLine,
  );
  $templateCache.put('app/telecom/pack/slots/task/pack-task.html', packTask);
  $templateCache.put(
    'app/telecom/pack/slots/voipEcoFax/pack-voipEcoFax.html',
    packVoipEcoFax,
  );
  $templateCache.put('app/telecom/pack/slots/hubic/pack-hubic.html', packHubic);
  $templateCache.put(
    'app/telecom/pack/slots/exchangeAccount/pack-exchangeAccount.html',
    packExchangeAccount,
  );
  $templateCache.put(
    'app/telecom/pack/slots/xdslAccess/pack-xdslAccess.html',
    packXdslAccess,
  );
  $templateCache.put(
    'app/telecom/pack/slots/informations/pack-informations.html',
    packInformations,
  );
  $templateCache.put(
    'app/telecom/pack/slots/promotionCode/pack-promotionCode.html',
    packPromotionCode,
  );
  $templateCache.put(
    'app/telecom/pack/slots/domain/pack-domain.html',
    packDomain,
  );
};
