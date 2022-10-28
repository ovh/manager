import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';
import service from './service';

const moduleName = 'ovhManagerPciGatewayModelSelector';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectGatewaysModelSelector', component)
  .service('PciProjectGatewayModelSelectorService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
