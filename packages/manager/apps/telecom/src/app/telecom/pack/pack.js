import packVoipLine from './slots/voipLine/pack-voipLine.html';
import packTask from './slots/task/pack-task.html';
import packVoipEcoFax from './slots/voipEcoFax/pack-voipEcoFax.html';
import packHubic from './slots/hubic/pack-hubic.html';
import packExchangeAccount from './slots/exchangeAccount/pack-exchangeAccount.html';
import packXdslAccess from './slots/xdslAccess/pack-xdslAccess.html';
import packInformations from './slots/informations/pack-informations.html';
import packPromotionCode from './slots/promotionCode/pack-promotionCode.html';
import packDomain from './slots/domain/pack-domain.html';

angular.module('managerApp').run(($templateCache) => {
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
});
angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack', {
    url: '/pack/:packName',
    views: {
      'telecomView@telecom': {
        templateUrl: 'app/telecom/pack/pack-main.view.html',
      },
      'packView@telecom.pack': {
        templateUrl: 'app/telecom/pack/pack.html',
        controller: 'PackCtrl',
        controllerAs: 'Pack',
      },
    },
    resolve: {
      resiliationNotification() {
        return {};
      },
      $title(translations, $translate, OvhApiPackXdsl, $stateParams) {
        return OvhApiPackXdsl.v6()
          .get({
            packId: $stateParams.packName,
          })
          .$promise.then(data => $translate.instant(
            'pack_xdsl_page_title',
            { name: data.description || $stateParams.packName },
            null,
            null,
            'escape',
          ))
          .catch(() => $translate.instant('pack_xdsl_page_title', {
            name: $stateParams.packName,
          }));
      },
    },
    translations: {
      value: [
        '.',
        './common',
        '../task',
        '../pack/slots/emailPro',
        '../pack/slots/task',
      ],
      format: 'json',
    },
  });
});
