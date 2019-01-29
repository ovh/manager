import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/manager-telecom-styles';
import '@ovh-ux/telecom-universe-components';
import 'ovh-api-services';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';

import { DASHBOARD_SERVICES, PACK } from './pack.constants';

import controller from './pack.controller';
import template from './pack.html';

import slots from './slots';

import './pack.scss';

import packVoipLine from './slots/voipLine/pack-voipLine.html';
import packTask from './slots/task/pack-task.html';
import packVoipEcoFax from './slots/voipEcoFax/pack-voipEcoFax.html';
import packHubic from './slots/hubic/pack-hubic.html';
import packExchangeAccount from './slots/exchangeAccount/pack-exchangeAccount.html';
import packXdslAccess from './slots/xdslAccess/pack-xdslAccess.html';
import packInformations from './slots/informations/pack-informations.html';
import packPromotionCode from './slots/promotionCode/pack-promotionCode.html';
import packDomain from './slots/domain/pack-domain.html';

const moduleName = 'ovhManagerPackModule';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ovhManagerCore',
    'telecomUniverseComponents',
    slots,
  ])
  .constant('PACK_DASHBOARD_SERVICES', DASHBOARD_SERVICES)
  .constant('PACK_PACK', PACK)
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pack', {
      url: '/pack/:packName',
      controller,
      template,
      controllerAs: 'Pack',

      resolve: {
        resiliationNotification() {
          return {};
        },
        $title(translations, $translate, OvhApiPackXdsl, $stateParams) {
          return OvhApiPackXdsl.v6().get({
            packId: $stateParams.packName,
          }).$promise
            .then(data => $translate.instant('pack_xdsl_page_title', { name: data.description || $stateParams.packName }, null, null, 'escape'))
            .catch(() => $translate.instant('pack_xdsl_page_title', { name: $stateParams.packName }));
        },
      },
      translations: [
        '.',
        './common',
        './slots/emailPro',
      ],
    });
  })
  .run(/* @ngInject */ ($templateCache) => {
    // import templates required by ng-include
    $templateCache.put('app/telecom/pack/slots/voipLine/pack-voipLine.html', packVoipLine);
    $templateCache.put('app/telecom/pack/slots/task/pack-task.html', packTask);
    $templateCache.put('app/telecom/pack/slots/voipEcoFax/pack-voipEcoFax.html', packVoipEcoFax);
    $templateCache.put('app/telecom/pack/slots/hubic/pack-hubic.html', packHubic);
    $templateCache.put('app/telecom/pack/slots/exchangeAccount/pack-exchangeAccount.html', packExchangeAccount);
    $templateCache.put('app/telecom/pack/slots/xdslAccess/pack-xdslAccess.html', packXdslAccess);
    $templateCache.put('app/telecom/pack/slots/informations/pack-informations.html', packInformations);
    $templateCache.put('app/telecom/pack/slots/promotionCode/pack-promotionCode.html', packPromotionCode);
    $templateCache.put('app/telecom/pack/slots/domain/pack-domain.html', packDomain);
  });


export default moduleName;
