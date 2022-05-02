import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './pci-order-command.component';

const moduleName = 'ovhManagerPciOrderCommand';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciOrderCommand', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
