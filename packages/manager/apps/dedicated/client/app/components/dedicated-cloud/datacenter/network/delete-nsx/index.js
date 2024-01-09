import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './dedicatedCloud-datacenter-network-delete-nsx.component';

const moduleName =
  'ovhManagerDedicatedCloudDatacenterNetworkDeleteNsxComponent';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('ovhManagerDedicatedCloudDatacenterNetworkDeleteNsx', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
