import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerAnthosComponentsAssignPrivateIp';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui'])
  .component('assignPrivateIp', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
