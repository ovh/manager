import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerAnthosComponentsAddStorage';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui'])
  .component('addStorage', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
