import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';
import 'ovh-ui-angular';
import 'ovh-api-services';

import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerPciStoragesBlocksBlockAttachDelete';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectStorageBlocksBlockDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
