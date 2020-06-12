import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ngOvhContractsSummary';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui'])
  .component('ovhContractsSummary', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
