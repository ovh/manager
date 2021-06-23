import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import routing from './ip-ip-agoraOrder.routes';
import controller from './ip-ip-agoraOrder.controller';
import service from './ip-ip-agoraOrder.service';
import template from './ip-ip-agoraOrder.html';

const moduleName = 'ovhManagerIpDashboardOrder';

angular
  .module(moduleName, [ngUiRouterLayout])
  .config(routing)
  .controller('agoraIpOrderCtrl', controller)
  .service('IpAgoraOrder', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('ip/ip/agoraOrder/ip-ip-agoraOrder.html', template);
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
