import angular from 'angular';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './terminate.component';

const moduleName = 'ovhManagerPciAdditionalIpsTerminateComponent';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('pciAdditionalIpsTerminate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
