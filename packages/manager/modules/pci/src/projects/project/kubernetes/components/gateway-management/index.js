import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerPciProjectKubeAddPrivateNetworkGatewayManagement';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('gatewayManagementComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
