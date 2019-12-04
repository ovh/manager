import angular from 'angular';
import 'angular-translate';

import '@ovh-ux/ng-ovh-contracts';

import component from './component';

const moduleName = 'wucOrderHelperValidation';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ngOvhContracts',
  ])
  .component('ovhManagerOrderValidation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
