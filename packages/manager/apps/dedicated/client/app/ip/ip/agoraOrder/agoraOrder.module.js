import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import routing from './ip-ip-agoraOrder.routes';
import controller from './ip-ip-agoraOrder.controller';

const moduleName = 'ovhManagerIpDashboardOrder';

angular
  .module(moduleName, [ngUiRouterLayout])
  .config(routing)
  .controller('agoraIpOrderCtrl', controller)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
