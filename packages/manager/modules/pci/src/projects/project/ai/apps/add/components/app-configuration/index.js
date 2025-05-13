import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './app-configuration.component';

const moduleName = 'ovhManagerPciProjectAppsAppConfiguration';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('appConfiguration', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
