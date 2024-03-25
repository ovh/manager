import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/manager-catalog-price';

import { region } from '@ovh-ux/manager-components';
import routing from './ip-ip-agoraOrder.routes';
import controller from './ip-ip-agoraOrder.controller';
import service from './ip-ip-agoraOrder.service';
import template from './ip-ip-agoraOrder.html';

const moduleName = 'ovhManagerIpDashboardOrder';

angular
  .module(moduleName, [ngUiRouterLayout, 'ovhManagerCatalogPrice', region])
  .config(routing)
  .controller('agoraIpOrderCtrl', controller)
  .service('IpAgoraOrder', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('ip/agoraOrder/ip-ip-agoraOrder.html', template);
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
