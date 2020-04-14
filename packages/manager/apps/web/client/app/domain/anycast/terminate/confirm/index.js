import angular from 'angular';
import 'angular-translate';

import confirmTerminate from './confirm.component';

const moduleName = 'domainAnycastConfirmTerminate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('domainAnycastConfirmTerminate', confirmTerminate)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
