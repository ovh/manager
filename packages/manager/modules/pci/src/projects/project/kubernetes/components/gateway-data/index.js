import angular from 'angular';
import 'angular-translate';

import component from './gateway-data.component';

const moduleName = 'ovhManagerPciProjectKubeGatewayData';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('pciKubeGatewayData', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
