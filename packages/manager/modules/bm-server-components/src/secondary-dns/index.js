import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './component';

import addDns from './add';
import deleteDns from './delete';

const moduleName = 'ovhManagerBmServerComponentsSecondaryDns';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', addDns, deleteDns])
  .component('serverSecondaryDns', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
