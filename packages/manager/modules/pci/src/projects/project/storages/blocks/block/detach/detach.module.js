import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './detach.component';
import routing from './detach.routing';

const moduleName = 'ovhManagerPciStoragesBlocksBlockDetach';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectStorageBlocksBlockDetach', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
