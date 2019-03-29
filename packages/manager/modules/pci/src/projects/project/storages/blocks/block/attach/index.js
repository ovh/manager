import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';
import 'ovh-ui-angular';
import 'ovh-api-services';

import component from './attach.component';
import routing from './attach.routing';

const moduleName = 'ovhManagerPciStoragesBlocksBlockAttach';

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
  .component('pciProjectStorageBlocksBlockAttach', component)

  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
