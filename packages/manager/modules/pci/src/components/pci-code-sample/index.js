import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './pci-code-sample.component';

const moduleName = 'ovhManagerPciCodeSample';

angular
  .module(moduleName, [
    'oui',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciCodeSample', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
