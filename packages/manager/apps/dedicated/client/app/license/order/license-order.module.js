import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './license-order.routes';
import service from './license-order.service';
import agoraOrderService from './agoraOrder/license-agoraOrder.service';

// import tooltips
import blockFilterTooltipTemplate from '../tooltips/blockFilterTooltip.html';

// import order legacy
import orderLegacyComponent from './order-legacy/component';

// import order vps
import orderVpsTemplate from './license-order-vps.html';
import orderVpsCtrl from './license-order-vps.controller';

// import options
import pleskOptionsComponent from './options/plesk/component';

const moduleName = 'licenseOrder';

angular
  .module(moduleName, [
    uiRouter,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('ovhManagerLicenseOrderLegacy', orderLegacyComponent)
  .component('ovhManagerPleskLicenseAdditionalOptions', pleskOptionsComponent)
  .controller('LicenseOrderVpsCtrl', orderVpsCtrl)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'license/tooltips/blockFilterTooltip.html',
        blockFilterTooltipTemplate,
      );

      $templateCache.put(
        'license/order/license-order-vps.html',
        orderVpsTemplate,
      );
    },
  )
  .service('LicenseOrder', service)
  .service('LicenseAgoraOrder', agoraOrderService);

export default moduleName;
