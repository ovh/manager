import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './warning.component';

const moduleName = 'ovhManagerPciDatbasaesWarning';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectDatabasesWarning', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
