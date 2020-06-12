import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './versions-list.component';

const moduleName = 'ovhManagerPciKubeVersionsList';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectVersionsList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
