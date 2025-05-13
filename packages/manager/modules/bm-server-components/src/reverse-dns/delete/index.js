import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhManagerBmServerComponentsReverseDnsDelete';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('serverReverseDnsDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
