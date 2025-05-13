import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './app-attach.component';

const moduleName = 'ovhManagerPciProjectAppsAppAttach';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('appAttach', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
