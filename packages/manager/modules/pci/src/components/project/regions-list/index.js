import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './regions-list.component';

const moduleName = 'ovhManagerPciRegionsList';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectRegionsList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
