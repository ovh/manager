import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './configuration-command.component';

const moduleName = 'ovhManagerPciNotebooksConfigurationCommand';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('managerNotebooksConfigurationCommand', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
