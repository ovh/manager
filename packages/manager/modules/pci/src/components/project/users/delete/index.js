import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './delete.component';

const moduleName = 'ovhManagerPciComponentsUsersDelete';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectUsersDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
