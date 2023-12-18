import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './volume-edit.component';

const moduleName = 'ovhManagerPciStoragesBlocksBlockVolumeEdit';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('pciProjectStorageVolumeEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
