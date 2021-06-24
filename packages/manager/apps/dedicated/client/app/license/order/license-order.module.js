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
import orderLegacyTemplate from './license-order-legacy.html';
import orderLegacyCtrl from './license-order-legacy.controller';

// import order dedicated
import orderDedicatedTemplate from './license-order-dedicated.html';
import orderDedicatedCtrl from './license-order-dedicated.controller';

// import order vps
import orderVpsTemplate from './license-order-vps.html';
import orderVpsCtrl from './license-order-vps.controller';

// import options
import cpanelOptionsTemplate from './options/CPANEL.html';
import directadminOptionsTemplate from './options/DIRECTADMIN.html';
import pleskOptionsTemplate from './options/PLESK.html';
import sqlServerOptionsTemplate from './options/SQLSERVER.html';
import virtuozzoOptionsTemplate from './options/VIRTUOZZO.html';
import windowsOptionsTemplate from './options/WINDOWS.html';
import worklightOptionsTemplate from './options/WORKLIGHT.html';

const moduleName = 'licenseOrder';

angular
  .module(moduleName, [
    uiRouter,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .config(routing)
  .controller('LicenseOrderClassicCtrl', orderLegacyCtrl)
  .controller('LicenseOrderDedicatedCtrl', orderDedicatedCtrl)
  .controller('LicenseOrderVpsCtrl', orderVpsCtrl)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'license/tooltips/blockFilterTooltip.html',
        blockFilterTooltipTemplate,
      );

      $templateCache.put(
        'license/order/license-order-legacy.html',
        orderLegacyTemplate,
      );

      $templateCache.put(
        'license/order/license-order-dedicated.html',
        orderDedicatedTemplate,
      );

      $templateCache.put(
        'license/order/license-order-vps.html',
        orderVpsTemplate,
      );

      $templateCache.put(
        'license/order/options/CPANEL.html',
        cpanelOptionsTemplate,
      );

      $templateCache.put(
        'license/order/options/DIRECTADMIN.html',
        directadminOptionsTemplate,
      );

      $templateCache.put(
        'license/order/options/PLESK.html',
        pleskOptionsTemplate,
      );

      $templateCache.put(
        'license/order/options/SQLSERVER.html',
        sqlServerOptionsTemplate,
      );

      $templateCache.put(
        'license/order/options/VIRTUOZZO.html',
        virtuozzoOptionsTemplate,
      );

      $templateCache.put(
        'license/order/options/WINDOWS.html',
        windowsOptionsTemplate,
      );

      $templateCache.put(
        'license/order/options/WORKLIGHT.html',
        worklightOptionsTemplate,
      );
    },
  )
  .service('LicenseOrder', service)
  .service('LicenseAgoraOrder', agoraOrderService);

export default moduleName;
