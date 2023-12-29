import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './terminate.component';

const moduleName =
  'ovhManagerBmServerComponentsDashboardServiceStatusTerminate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('serverServiceStatusTerminate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
