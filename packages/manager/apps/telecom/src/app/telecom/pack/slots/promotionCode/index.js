import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './promotionCode.controller';
import template from './promotionCode.html';
import templateModal from './promotionCode.modal.html';

const moduleName = 'ovhManagerTelecomPackPromotionCode';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .controller('PromotionCodeCtrl', controller)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/pack/slots/promotionCode/promotionCode.modal.html',
        templateModal,
      );
      $templateCache.put(
        'app/telecom/pack/slots/promotionCode/promotionCode.html',
        template,
      );
    },
  );

export default moduleName;
