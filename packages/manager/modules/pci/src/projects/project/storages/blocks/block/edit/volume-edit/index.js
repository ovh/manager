import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';

import component from './volume-edit.component';

const moduleName = 'ovhManagerPciStoragesBlocksBlockVolumeEdit';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectStorageVolumeEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
